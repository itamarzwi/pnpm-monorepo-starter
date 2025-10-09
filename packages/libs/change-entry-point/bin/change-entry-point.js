import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { isCI } from 'ci-info';
const rewritePath = (value) => value.replace(/^(\.\/)?src\//, './dist/').replace(/(?<!\.d)\.ts$/, '.js');
const rewriteExports = (exportsMap) => {
    for (const [key, val] of Object.entries(exportsMap)) {
        if (typeof val === 'string') {
            exportsMap[key] = rewritePath(val);
        }
        else if (typeof val === 'object' && val !== null) {
            const updated = { ...val };
            if (val.import)
                updated.import = rewritePath(val.import);
            if (val.require)
                updated.require = rewritePath(val.require);
            if (val.default)
                updated.default = rewritePath(val.default);
            exportsMap[key] = updated;
        }
    }
};
const rewriteMain = (manifest) => {
    if (!manifest.main) {
        throw new Error('Missing manifest.main');
    }
    if (manifest.main__prod) {
        if (typeof manifest.main__prod !== 'string') {
            throw new TypeError(`Invalid main__prod value`);
        }
        manifest.main = manifest.main__prod;
        return;
    }
    manifest.main = rewritePath(manifest.main);
};
/** Note: This function does not rewrite the file, it only accepts an object and modifies it */
export const changeManifestEntryPoint = (manifest) => {
    if (manifest.exports) {
        rewriteExports(manifest.exports);
    }
    else {
        rewriteMain(manifest);
    }
};
export const changeEntryPointByCwd = (cwd) => {
    const pathToManifest = path.resolve(cwd, './package.json');
    const manifest = JSON.parse(readFileSync(pathToManifest, 'utf8'));
    changeManifestEntryPoint(manifest);
    writeFileSync(pathToManifest, JSON.stringify(manifest, null, 4));
};
export const changeEntryPoint = (force = false) => {
    if (isCI || force) {
        changeEntryPointByCwd(process.cwd());
    }
};

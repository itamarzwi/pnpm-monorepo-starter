import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { isCI } from 'ci-info';

// https://nodejs.org/api/packages.html#exports
const exportConditions = [
  'node-addons',
  'node',
  'import',
  'require',
  'module-sync',
  'default',
] as const;
type ExportCondition = (typeof exportConditions)[number];

export interface Manifest {
  main?: string;
  main__prod?: string;
  exports?: Record<string, string | {
    [key in ExportCondition]?: string;
  }>;
}

const rewritePath = (value: string): string =>
  value.replace(/^(\.\/)?src\//, './dist/').replace(/(?<!\.d)\.ts$/, '.js');

const rewriteExports = (exportsMap: Required<Manifest>['exports']) => {
  for (const [key, val] of Object.entries(exportsMap)) {
    if (typeof val === 'string') {
      exportsMap[key] = rewritePath(val);
    } else if (typeof val === 'object' && val !== null) {
      const updated = { ...val };
      for (const condition of exportConditions) {
        if (val[condition]) {
          updated[condition] = rewritePath(val[condition]);
        }
      }
      exportsMap[key] = updated;
    }
  }
};

const rewriteMain = (manifest: Manifest) => {
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
export const changeManifestEntryPoint = (manifest: Manifest) => {
  if (manifest.exports) {
    rewriteExports(manifest.exports);
  } else {
    rewriteMain(manifest);
  }
};

export const changeEntryPointByCwd = (cwd: string) => {
  const pathToManifest = path.resolve(cwd, './package.json');
  const manifest = JSON.parse(readFileSync(pathToManifest, 'utf8')) as Manifest;
  changeManifestEntryPoint(manifest);
  writeFileSync(pathToManifest, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
};

export const changeEntryPoint = (force = false) => {
  if (isCI || force) {
    changeEntryPointByCwd(process.cwd());
  }
};

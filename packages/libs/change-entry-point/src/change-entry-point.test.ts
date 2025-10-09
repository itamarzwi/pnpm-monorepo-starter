import assert from 'node:assert/strict';
import test from 'node:test';

import { changeManifestEntryPoint } from './change-entry-point.js';

void test('use main__prod if it exists', () => {
    const manifest = {
        main: 'a',
        main__prod: 'b',
    };

    changeManifestEntryPoint(manifest);
    assert.strictEqual(manifest.main, 'b');
});

void test('do not replace generic main without main__prod', () => {
    const manifest = {
        main: 'a',
    };

    changeManifestEntryPoint(manifest);
    assert.strictEqual(manifest.main, 'a');
});

void test('replace main=src/index.ts without main__prod', () => {
    const manifest = {
        main: 'src/index.ts',
    };

    changeManifestEntryPoint(manifest);
    assert.strictEqual(manifest.main, './dist/index.js');
});

void test('replace main=./src/index.ts without main__prod', () => {
    const manifest = {
        main: './src/index.ts',
    };

    changeManifestEntryPoint(manifest);
    assert.strictEqual(manifest.main, './dist/index.js');
});

void test('throw on invalid main__prod', () => {
    const manifest = {
        main: 'a',
        // @ts-expect-error Wrong type on purpose for check
        main__prod: 1 as string,
    };

    assert.throws(() => changeManifestEntryPoint(manifest));
});

void test('throw on missing main field', () => {
    const manifest = {
        main__prod: 'b',
    };

    assert.throws(() => changeManifestEntryPoint(manifest));
});

void test('rewrite exports: simple string', () => {
    const manifest = {
        exports: {
            '.': './src/index.ts',
        },
    };

    changeManifestEntryPoint(manifest);
    assert.strictEqual(manifest.exports['.'], './dist/index.js');
});

void test('rewrite exports: object with import/require/types', () => {
    const manifest = {
        exports: {
            '.': {
                import: './src/index.ts',
                require: './src/index.ts',
                types: './src/index.ts',
            },
        },
    };

    changeManifestEntryPoint(manifest);
    assert.deepStrictEqual(manifest.exports['.'], {
        import: './dist/index.js',
        require: './dist/index.js',
        types: './src/index.ts',
    });
});

void test('rewrite exports: mix of formats', () => {
    const manifest = {
        exports: {
            '.': {
                import: './src/index.ts',
                types: './src/index.ts',
            },
            './sub': './src/sub.ts',
        },
    };

    changeManifestEntryPoint(manifest);
    assert.deepStrictEqual(manifest.exports, {
        '.': {
            import: './dist/index.js',
            types: './src/index.ts',
        },
        './sub': './dist/sub.js',
    });
});

void test('rewrite exports: dist in key but src in value', () => {
    const manifest = {
        exports: {
            './dist/*.css': {
                import: './src/*.css',
                require: './src/*.css',
            },
        },
    };

    changeManifestEntryPoint(manifest);
    assert.deepStrictEqual(manifest.exports, {
        './dist/*.css': {
            import: './dist/*.css',
            require: './dist/*.css',
        },
    });
});

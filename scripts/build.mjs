// Bundles the piece into one self-contained file, the format Activepieces
// installs from npm (main: ./src/index.js, no @activepieces/* dependencies).
import { build } from 'esbuild';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ap = resolve(root, '.activepieces/packages');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

rmSync(resolve(root, 'dist'), { recursive: true, force: true });
mkdirSync(resolve(root, 'dist/src'), { recursive: true });

await build({
	entryPoints: [resolve(root, 'src/index.ts')],
	outfile: resolve(root, 'dist/src/index.js'),
	bundle: true,
	platform: 'node',
	format: 'cjs',
	target: 'node20',
	keepNames: true,
	legalComments: 'inline',
	nodePaths: [resolve(root, 'node_modules')],
	alias: {
		'@activepieces/core-utils': resolve(ap, 'core/utils/src/index.ts'),
		'@activepieces/core-piece-types': resolve(ap, 'core/piece-types/src/index.ts'),
		'@activepieces/core-formula': resolve(ap, 'core/formula/src/index.ts'),
		'@activepieces/core-execution': resolve(ap, 'core/execution/src/index.ts'),
		'@activepieces/pieces-framework': resolve(ap, 'pieces/framework/src/index.ts'),
		'@activepieces/pieces-common': resolve(ap, 'pieces/common/src/index.ts'),
	},
});

const out = {
	name: pkg.name,
	version: pkg.version,
	description: pkg.description,
	license: pkg.license,
	author: pkg.author,
	homepage: pkg.homepage,
	repository: pkg.repository,
	keywords: pkg.keywords,
	main: './src/index.js',
	dependencies: {},
	files: ['src/index.js', 'package.json', 'README.md', 'LICENSE'],
};
writeFileSync(resolve(root, 'dist/package.json'), JSON.stringify(out, null, 2) + '\n');
cpSync(resolve(root, 'README.md'), resolve(root, 'dist/README.md'));
cpSync(resolve(root, 'LICENSE'), resolve(root, 'dist/LICENSE'));
console.log('built dist/ for', pkg.name, pkg.version);


import esbuild from 'esbuild';

export function buildBackground() {
    esbuild.buildSync({
        entryPoints: ['src/background.ts'],
        bundle: true,
        outfile: 'dist/background.js',
        platform: 'neutral',
        external: ['electron']
    })
}
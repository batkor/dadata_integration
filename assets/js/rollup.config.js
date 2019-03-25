import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: 'source/finder.js',
    external: ['drupalCore', 'drupalSettingsCore'],
    output: {
      file: 'dist/dadata_finder.js',
      format: 'iife',
      globals: {
        drupalCore: 'Drupal',
        drupalSettingsCore: 'drupalSettings',
      },
    },
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
    ],
  },
  {
    input: 'source/main.js',
    external: ['drupalCore', 'drupalSettingsCore'],
    output: {
      file: 'dist/dadata_init.js',
      format: 'iife',
      globals: {
        drupalCore: 'Drupal',
        drupalSettingsCore: 'drupalSettings',
      },
    },
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
    ],
  },
];
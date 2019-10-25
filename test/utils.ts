import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  compile as svelteCompile,
  preprocess as sveltePreprocess,
} from 'svelte/compiler';

export const CSS_PATTERN = /div(\.svelte-\w{4,7})?\s*\{\s*color:\s*(red|#f00);?\s*\}/;

export const preprocess = async (input: string, opts: any) =>
  sveltePreprocess(input, opts, { filename: resolve(__dirname, 'App.svelte') });

const compile = async (input: string, magicOpts: any) => {
  const preprocessed = await exports.preprocess(input, magicOpts);
  const { js, css } = svelteCompile(preprocessed.toString(), {
    css: true,
  });

  return { js, css };
};

export const doesCompileThrow = async (input: string, opts: any) => {
  let didThrow = false;
  try {
    await compile(input, opts);
  } catch (err) {
    didThrow = true;
  }
  return didThrow;
};

export const getFixturePath = (file: string) =>
  resolve(__dirname, 'fixtures', file);

export const getFixtureContent = (file: string) =>
  readFileSync(exports.getFixturePath(file))
    .toString()
    .trim();

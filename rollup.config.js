import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import dotenv from "dotenv";
import json from "@rollup/plugin-json";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: !isProduction,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: !isProduction,
      },
    ],
    watch: {
      clearScreen: false,
      include: "src/**",
    },
    plugins: [
      external(),
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        sourceMap: !isProduction,
        tsconfig: "./tsconfig.json",
        exclude: ["./example/**", "./src/test/**"],
      }),
      process.env.NODE_ENV === "production" && terser(),
      json(),
    ],
    external: ["react", "react-dom", "styled-components", "etherspot"],
    context: "window",
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts(), json()],
    external: ["react", "react-dom", "styled-components", "etherspot"],
    watch: {
      clearScreen: false,
      include: "src/**",
    },
  },
];

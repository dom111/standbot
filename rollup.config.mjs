import commonjs from "@rollup/plugin-commonjs"
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "dist/bot.js",
      format: "esm",
      name: "bot"
    },
    treeshake: false,
    plugins: [
      typescript(),
      commonjs()
    ]
  }
]

import library from "@yoshinani/style-guide/eslint/library"

const eslintConfig = [
  ...library,
  {
    ignores: ["eslint.config.mjs"],
  },
]

export default eslintConfig

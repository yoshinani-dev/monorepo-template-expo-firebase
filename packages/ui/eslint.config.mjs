import react from "@yoshinani/style-guide/eslint/react-internal"

const eslintConfig = [
  ...react,
  {
    ignores: ["**/*.config.mjs"],
  },
]

export default eslintConfig

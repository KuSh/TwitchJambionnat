module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.cjs", "dist/**"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2021,
  },
  env: {
    es2021: true,
    node: true,
  },
};

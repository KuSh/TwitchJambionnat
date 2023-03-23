module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    // Alternative to typescript deprecated importsNotUsedAsValues
    "@typescript-eslint/consistent-type-imports": "error",
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  parserOptions: {
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
  },
};

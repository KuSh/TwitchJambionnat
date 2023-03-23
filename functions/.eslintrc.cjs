module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
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
    project: ["./tsconfig.json"],
  },
  env: {
    es6: true,
    node: true,
  },
};

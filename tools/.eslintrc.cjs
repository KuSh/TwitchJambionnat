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
  ignorePatterns: ["*.cjs", "dist/**"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2021,
    project: ["./tsconfig.json"],
  },
  env: {
    es2021: true,
    node: true,
  },
};

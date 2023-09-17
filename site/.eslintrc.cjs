module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:svelte/recommended",
    "prettier",
  ],
  rules: {
    // Alternative to typescript deprecated importsNotUsedAsValues
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.js", "*.cjs"],
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: { parser: "@typescript-eslint/parser" },
    },
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"],
    project: ["./tsconfig.json"],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};

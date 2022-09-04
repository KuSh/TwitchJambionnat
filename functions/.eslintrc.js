module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
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

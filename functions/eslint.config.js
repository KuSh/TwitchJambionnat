// @ts-check

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import ts from "typescript-eslint";

export default ts.config(
  { ignores: ["*.js", "lib/**/*"] },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
);

// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  expoConfig,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs["flat/recommended"],
  prettierConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: true,
          },
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: true,
          },
        },
      ],
    },
  },
  {
    ignores: ["dist/*", ".expo/*"],
  },
]);

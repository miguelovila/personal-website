import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // TypeScript and JavaScript files
  ...tseslint.configs.recommended,

  // Astro files
  ...eslintPluginAstro.configs.recommended,

  // JSX accessibility
  jsxA11y.flatConfigs.recommended,

  {
    rules: {
      // Customize rules as needed
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  {
    ignores: ["dist/", ".astro/", "node_modules/", "*.config.js", "*.config.mjs", "*.config.ts"],
  },
];

import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // TypeScript and JavaScript files
  ...tseslint.configs.recommended,

  // Astro files
  ...eslintPluginAstro.configs.recommended,

  // JSX accessibility
  { ...jsxA11y.flatConfigs.recommended, files: ["**/*.{jsx,tsx}"] },
  ...eslintPluginAstro.configs["jsx-a11y-recommended"].map((config) => ({
    ...config,
    files: config.files ?? ["**/*.astro"],
  })),

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
    ignores: [
      "dist/",
      ".test-dist/",
      ".test-dist-landing/",
      ".astro-test/",
      ".astro/",
      "node_modules/",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
];

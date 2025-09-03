// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/*",
      "node_modules/**",
      ".yalc/**",
      "android/**",
      "ios/**",
      "web-build/**",
      ".expo/**",
      ".expo-router/**",
    ],
    rules: {
      "react/display-name": "off",
    },
  },
  {
    files: [
      "rn-better-dev-tools/src/features/sentry/utils/sentryEventListeners.ts",
    ],
    rules: {
      "import/no-unresolved": "off",
    },
  },
  {
    files: ["rn-better-dev-tools/src/features/env/hooks/useDynamicEnv.ts"],
    rules: {
      "expo/no-dynamic-env-var": "off",
    },
  },
  {
    files: [
      "rn-better-dev-tools/src/features/react-query/components/GameUIQueryDetails.tsx",
    ],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
]);

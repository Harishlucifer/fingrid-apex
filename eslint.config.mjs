import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      /*
       * Page files carry long-form marketing prose, and apostrophes in that
       * copy are not a correctness hazard. The characters this rule exists to
       * catch — `<`, `>`, `{`, `}` — are still escaped in the page content.
       */
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;

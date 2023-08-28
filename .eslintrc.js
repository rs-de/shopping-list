/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    "cypress/globals": true,
  },
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "prettier",
    "plugin:cypress/recommended",
  ],
  plugins: ["cypress"],
};

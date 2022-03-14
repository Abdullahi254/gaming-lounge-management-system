module.exports = {
  "root": true,
  "env": {
    es6: true,
    node: true,
  },
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "rules": {
    "quotes": ["error", "double"],
    "new-cap": ["error", {"capIsNew": false}],
  },
  "parserOptions": {
    // Required for certain syntax usages
    "ecmaVersion": 2020,
  },
};

module.exports = {
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-native"
  ],
  "rules": {
    "indent": [
      2,
      2,
      {
        "VariableDeclarator": {
          "var": 2,
          "let": 2,
          "const": 3
        }
      }
    ],
    "linebreak-style": [
      2,
      "unix"
    ],
    "quotes": [
      2,
      "single"
    ],
    "semi": [
      2,
      "never"
    ]
  }
};

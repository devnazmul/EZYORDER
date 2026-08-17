module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": [
      2,
      "always",
      ["app", "api", "owner", "auth", "driver", "config", "deps", "assets"],
    ],
  },
};

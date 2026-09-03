module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": [
      2,
      "always",
      [
        // Global / App level
        "app",
        "api",
        "config",
        "deps",
        "assets",
        "core",
        "shared",

        // Features
        "auth",
        "coupon-and-campaign",
        "dashboard",
        "driver",
        "expenses",
        "menu",
        "more",
        "notifications",
        "order",
        "owner",
        "partners",
        "profile",
        "reports",
        "restaurants",
        "settings",
        "tables-and-reservations",
        "user-management",
      ],
    ],
  },
};

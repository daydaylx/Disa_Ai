/** Conventional Commits, schlank gehalten */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "perf", "docs", "test", "chore", "build", "ci", "revert"]
    ]
  }
};

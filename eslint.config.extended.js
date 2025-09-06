import baseTypes from "./eslint.config.types.js";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default baseTypes.map((c) => {
  if (!("ignores" in c) || !c.ignores) return c;
  const remove = new Set(["src/shared/**", "src/entities/**", "src/widgets/**", "src/features/**"]);
  return {
    ...c,
    ignores: c.ignores.filter((p) => !remove.has(p)),
  };
});

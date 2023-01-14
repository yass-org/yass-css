import { DesignToken } from "../types";

export const createVariableName = (token: DesignToken) => {
  const { category, name } = token

  if(!category) {
    return `--${name}`
  }

  return `--${category}-${name}`
}

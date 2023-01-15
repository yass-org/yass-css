import { Config } from "../config";
import { DesignToken } from "../types";

export const createCustomPropertyName = (token: DesignToken, config: Config) => {
  const { key } = token
  const namespace = config?.token?.namespace || ''

  return `--${namespace}${key}`
}

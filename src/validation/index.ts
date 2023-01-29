import { DesignToken } from "../types";

export const validateToken = (
  token: DesignToken
): { isValid: boolean; reason?: string } => {
  if (!token.key) {
    return { isValid: false, reason: "A token must define a key" };
  }

  if (!token.value) {
    return { isValid: false, reason: "A token must define a value" };
  }

  const hasProperties = token.properties && token.properties.length > 0;

  if (!(token.category || hasProperties)) {
    return {
      isValid: false,
      reason: "A token must define either a category, or a list of properties",
    };
  }

  return { isValid: true };
};

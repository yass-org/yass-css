export const escape = (str: string, specialCharacters: string[]): string => {
  return specialCharacters.reduce((escapedString, specialChar) => {
    return escapedString.replace(specialChar, `\\${specialChar}`)
  }, str)
}

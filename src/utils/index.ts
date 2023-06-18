
export const arrayContainsSubstring = (arr: string[], substring: string) => {
  return !!arr.find((el: string) => {
    return el.match(substring)
  })
}

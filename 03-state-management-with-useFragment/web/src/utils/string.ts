export const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1)

export const pluralize = (singularWord: string, count: number) => {
  return count === 1 ? singularWord : `${singularWord}s`
}

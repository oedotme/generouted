export const classNames = (...list: (false | null | undefined | string)[]): string => {
  return list.filter(Boolean).join(' ')
}

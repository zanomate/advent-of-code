export const isInEnum = (value: string, enumType: any): boolean => {
  return Object.values(enumType).includes(value)
}

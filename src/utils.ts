export const patterns = {
  clean: [/\/src\/pages\/|\.(jsx|tsx)$/g, ''],
  catch: [/\[\.{3}.+\]/, '*'],
  param: [/\[([^\]]+)\]/g, ':$1'],
  index: [/index|\./g, '/'],
} as const

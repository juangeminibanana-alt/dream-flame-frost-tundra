/** Une clases de CSS Modules (con noUncheckedIndexedAccess cada clase es string | undefined) en un string. */
export function cx(...xs: Array<string | false | null | undefined>): string {
  return xs.filter((x): x is string => typeof x === 'string' && x !== '').join(' ');
}

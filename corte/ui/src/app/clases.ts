/**
 * @/app · une nombres de clase (los de CSS Modules son `string | undefined` con noUncheckedIndexedAccess) e ignora los
 * vacíos. Interno del paquete ui-marco (app/ y raiz/); no sale en el barril.
 */
export function cx(...clases: Array<string | false | null | undefined>): string {
  let salida = '';
  for (const c of clases) {
    if (!c) continue;
    salida = salida ? `${salida} ${c}` : c;
  }
  return salida;
}

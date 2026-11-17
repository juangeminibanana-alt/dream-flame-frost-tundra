/* Corte · tema inicial (BUILD_SPEC §8.1). Se carga bloqueante en <head>, antes de los estilos, para que no haya
   destello oscuro → claro: lee la última preferencia aplicada (la escribe ui-marco en localStorage['corte.tema'])
   y la pone en <html data-theme>. Sin la clave, o si el almacenamiento no está disponible, queda "system". */
(function () {
  try {
    var tema = window.localStorage.getItem('corte.tema');
    if (tema === 'dark' || tema === 'light' || tema === 'system') {
      document.documentElement.setAttribute('data-theme', tema);
    }
  } catch (e) {
    /* Almacenamiento bloqueado: se queda data-theme="system". */
  }
})();

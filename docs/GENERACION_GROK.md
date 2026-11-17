# Generación de imágenes y video con Grok Imagine

La pantalla `#/videos/generar` crea cuatro ideas fotográficas y anima la imagen que el usuario elige. Cada lote conserva su color y relación de aspecto; cada video conserva la foto inicial, la idea y los ajustes con los que se solicitó.

## Contrato y modelos

- Imagen: `grok-imagine-image-2.0`, `POST /v1/images/edits`, JSON con hasta cinco imágenes de referencia.
- Video: `grok-imagine-video-1.5`, `POST /v1/videos/generations`, con la foto elegida en `image`, las referencias en `reference_images` y `generate_audio: false`.
- La foto inicial ocupa `<IMAGE_0>`; las siete referencias posteriores ocupan `<IMAGE_1>` a `<IMAGE_7>`.
- Duración: enteros de 1 a 15 segundos. Este flujo de referencias ofrece 480p y 720p. Los valores explícitos inválidos se rechazan antes de generar.
- El inicio de video devuelve `request_id`. El seguimiento usa `GET /v1/videos/{request_id}`; solo se considera terminado cuando el estado es `done` y existe una URL de video válida.

Contrato de la aplicación: `src/studio/generation-types.ts`. Validaciones y llamadas externas permanecen en servidor; el navegador no recibe `XAI_API_KEY`.

Fuentes oficiales comprobadas el 17 de noviembre de 2026: [edición de imágenes](https://docs.x.ai/developers/model-capabilities/images/editing), [múltiples referencias](https://docs.x.ai/developers/model-capabilities/images/multi-image-editing), [generación de video](https://docs.x.ai/developers/model-capabilities/video/generation) y [referencias de video](https://docs.x.ai/developers/model-capabilities/video/reference-to-video). Revalidar estas páginas antes de cambiar modelos o parámetros.

## Disponibilidad y operación

La plataforma debe inyectar `XAI_API_KEY` únicamente en servidor. No crear archivos `.env` ni variables `VITE_` con la clave. Si falta, la pantalla muestra que la generación no está disponible y conserva los resultados que el navegador ya tenga.

Las solicitudes generativas son iniciadas por el usuario. No hay generación automática al cargar ni reintentos de POST con variantes de esquema. Los errores de transporte, respuestas no válidas y fallos de xAI se traducen a estados recuperables de la interfaz. El servidor también limita concurrencia y frecuencia por proceso; ese límite no sustituye una cuota distribuida ni el control de acceso en un despliegue público de varias instancias.

## Seguimiento y conservación de resultados

El navegador guarda un estado versionado con las ideas, el folio pendiente y el último video completado. Al recargar se consulta el mismo folio, sin solicitar otro video. Las revisiones transitorias usan espera progresiva; después de diez minutos se ofrece reanudar. Pausar el seguimiento detiene las consultas locales, no cancela una generación ya aceptada por xAI.

Un fallo de una nueva generación no elimina el último video. Al completar ideas fallidas se conservan las fotos exitosas del mismo color y encuadre. Las ideas de otra variante no se pueden animar como si correspondieran a los ajustes actuales.

Las URL de xAI son temporales: guardar el estado local no archiva los archivos del proveedor. Descargar los originales mediante los controles de la pantalla. Si el proveedor impide la descarga directa desde el navegador, se ofrece abrir el original. Si el almacenamiento local está bloqueado o lleno, la pantalla lo indica y mantiene el trabajo durante la sesión.

Las nuevas generaciones no escriben sobre archivos de `public/`, no comparten nombres como `hero.mp4` entre trabajos y no necesitan `ffmpeg`. Los medios históricos incluidos en el repositorio permanecen intactos. No se añade una base de datos ni autenticación a este flujo.

## Verificación

```sh
npm run test:studio
npm run typecheck
npm run build
```

`npm test` también incluye las pruebas de generación. Usan respuestas controladas y no consumen cuota de xAI. Cubren parámetros, referencias y fotograma elegido, errores y estados de seguimiento, concurrencia y recuperación del estado local. La verificación visual debe incluir escritorio y móvil, disponibilidad sin clave y el recorrido de selección, seguimiento y descarga con un entorno de pruebas autorizado.

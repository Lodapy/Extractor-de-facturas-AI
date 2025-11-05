/**
 * Procesa un array de items en paralelo con un límite de concurrencia
 * @param items Array de items a procesar
 * @param fn Función async que procesa cada item
 * @param concurrencyLimit Número máximo de operaciones concurrentes
 * @param delayMs Delay en milisegundos entre cada inicio de procesamiento (para rate limiting)
 * @param onProgress Callback opcional para reportar progreso
 */
export async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrencyLimit: number = 5,
  delayMs: number = 0,
  onProgress?: (completed: number, total: number, result: R) => void
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let completedCount = 0;
  let currentIndex = 0;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processNext = async (): Promise<void> => {
    while (currentIndex < items.length) {
      const index = currentIndex++;

      try {
        const result = await fn(items[index], index);
        results[index] = result;
        completedCount++;

        if (onProgress) {
          onProgress(completedCount, items.length, result);
        }
      } catch (error) {
        // Si hay un error no capturado, registrarlo pero continuar
        console.error(`Error processing item at index ${index}:`, error);
        completedCount++;
      }

      // Añadir delay entre solicitudes para cumplir con rate limiting (60 RPM = 1 req/segundo)
      if (delayMs > 0 && currentIndex < items.length) {
        await sleep(delayMs);
      }
    }
  };

  // Iniciar el número de workers concurrentes
  const workers = Array(Math.min(concurrencyLimit, items.length))
    .fill(null)
    .map(() => processNext());

  await Promise.all(workers);
  return results;
}

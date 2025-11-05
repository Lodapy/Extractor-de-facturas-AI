/**
 * Procesa un array de items en paralelo con un límite de concurrencia
 * @param items Array de items a procesar
 * @param fn Función async que procesa cada item
 * @param concurrencyLimit Número máximo de operaciones concurrentes
 * @param onProgress Callback opcional para reportar progreso
 */
export async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrencyLimit: number = 5,
  onProgress?: (completed: number, total: number, result: R) => void
): Promise<R[]> {
  const results: R[] = [];
  let completedCount = 0;
  let currentIndex = 0;

  const processNext = async (): Promise<void> => {
    const index = currentIndex++;
    if (index >= items.length) return;

    try {
      const result = await fn(items[index], index);
      results[index] = result;
      completedCount++;

      if (onProgress) {
        onProgress(completedCount, items.length, result);
      }
    } catch (error) {
      // El error se maneja en la función fn, aquí solo lo propagamos
      throw error;
    }

    // Procesar el siguiente item
    await processNext();
  };

  // Iniciar el número de workers concurrentes
  const workers = Array(Math.min(concurrencyLimit, items.length))
    .fill(null)
    .map(() => processNext());

  await Promise.all(workers);
  return results;
}

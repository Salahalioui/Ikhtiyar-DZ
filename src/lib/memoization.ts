export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Example usage for student score calculation
export const memoizedCalculateScore = memoize(
  (evaluations: Record<string, number>) => {
    return Object.values(evaluations).reduce((a, b) => a + b, 0) / 
           Object.values(evaluations).length;
  }
); 
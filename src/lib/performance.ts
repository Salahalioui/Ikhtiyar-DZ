export const performance = {
  startMeasure: (name: string) => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-start`);
    }
  },

  endMeasure: (name: string) => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      const measurements = performance.getEntriesByName(name);
      console.log(`${name} took ${measurements[0].duration.toFixed(2)}ms`);
    }
  }
}; 
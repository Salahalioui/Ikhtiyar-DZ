import { useState, useEffect, useCallback } from 'react';

interface UseLazyLoadOptions<T> {
  items: T[];
  initialBatchSize?: number;
  batchSize?: number;
  delay?: number;
}

export function useLazyLoad<T>({
  items,
  initialBatchSize = 20,
  batchSize = 10,
  delay = 100
}: UseLazyLoadOptions<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDisplayedItems(items.slice(0, initialBatchSize));
    setHasMore(items.length > initialBatchSize);
  }, [items, initialBatchSize]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    const currentLength = displayedItems.length;
    const nextBatch = items.slice(currentLength, currentLength + batchSize);

    setTimeout(() => {
      setDisplayedItems(prev => [...prev, ...nextBatch]);
      setHasMore(currentLength + nextBatch.length < items.length);
      setIsLoading(false);
    }, delay);
  }, [displayedItems, items, batchSize, hasMore, isLoading, delay]);

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore
  };
} 
import { useMemo } from "react";

export function useFilteredList<T>(
  items: T[],
  filters: any,
  searchQuery: string,
  filterFn: (item: T, filters: any, searchQuery: string) => boolean,
  sortFn: (a: T, b: T, filters: any) => number,
): T[] {
  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) => filterFn(item, filters, searchQuery));

    const sorted = [...filtered].sort((a, b) => sortFn(a, b, filters));

    return sorted;
  }, [items, filters, searchQuery, filterFn, sortFn]);

  return filteredItems;
}

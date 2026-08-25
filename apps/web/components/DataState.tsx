import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

export interface DataStateProps<T> {
  query: {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };
  skeleton: React.ReactNode;
  emptyMessage: string;
  isEmpty: (data: T) => boolean;
  children: (data: T) => React.ReactNode;
}

// Every data-driven card goes through exactly one of these four states —
// centralizing the branching here means loading/error/empty handling is
// consistent everywhere instead of re-implemented per card.
export function DataState<T>({
  query,
  skeleton,
  emptyMessage,
  isEmpty,
  children,
}: DataStateProps<T>) {
  if (query.isLoading) return <>{skeleton}</>;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  if (query.data === undefined || isEmpty(query.data)) {
    return <EmptyState message={emptyMessage} />;
  }
  return <>{children(query.data)}</>;
}

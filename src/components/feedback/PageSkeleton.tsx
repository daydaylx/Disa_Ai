import * as React from "react";

import { Skeleton } from "./Loader";

interface PageSkeletonProps {
  message?: string;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ message }) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="mt-4 space-y-3">
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[65%]" />
      </div>
      {message ? <p className="mt-6 text-sm text-white/60">{message}</p> : null}
    </div>
  );
};

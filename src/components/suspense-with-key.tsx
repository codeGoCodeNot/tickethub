"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SuspenseWithKey = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  return (
    <Suspense key={searchParams.toString()} fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default SuspenseWithKey;

"use client";

import Pagination from "@/components/pagination";
import { useQueryStates } from "nuqs";
import { activityLogPaginationOptions, activityLogPaginationParser } from "../search-params";

type ActivityLogPaginationProps = {
  paginatedMetadata: { count: number; hasNextPage: boolean };
};

const ActivityLogPagination = ({ paginatedMetadata }: ActivityLogPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    activityLogPaginationParser,
    activityLogPaginationOptions,
  );

  return (
    <Pagination
      pagination={pagination}
      onPagination={setPagination}
      paginatedMetadata={paginatedMetadata}
    />
  );
};

export default ActivityLogPagination;

import { createSearchParamsCache, parseAsInteger } from "nuqs/server";

export const activityLogPaginationParser = {
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(10),
};

export const activityLogPaginationOptions = {
  shallow: false,
  clearOnDefault: true,
  scroll: false,
};

export const activityLogSearchParamsCache = createSearchParamsCache({
  ...activityLogPaginationParser,
});

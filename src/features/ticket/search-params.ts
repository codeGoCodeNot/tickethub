import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});
export const sortParser = parseAsString.withDefault("newest").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const paginationParser = {
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(5),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
  scroll: false,
};

export const searchParamsCache = createSearchParamsCache({
  search: searchParser,
  sort: sortParser,
  ...paginationParser,
});

// export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;

import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsBoolean,
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

export const orgOnlyParser = parseAsBoolean.withDefault(false).withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const searchParamsCache = createSearchParamsCache({
  search: searchParser,
  sort: sortParser,
  orgOnly: orgOnlyParser,
  ...paginationParser,
});

// export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;

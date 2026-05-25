import getTickets from "@/features/ticket/queries/get-tickets";
import { searchParamsCache } from "@/features/ticket/search-params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const untypedSearchParams = Object.fromEntries(searchParams);
  const { search, sort, page, size } =
    searchParamsCache.parse(untypedSearchParams);

  const { list, metadata } = await getTickets(
    undefined,
    undefined,
    search,
    sort,
    page,
    size,
  );

  return Response.json({ list, metadata });
}

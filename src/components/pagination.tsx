import { Button } from "./ui/button";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPagination: (pagination: PageAndSize) => void;
  paginatedMetadata: {
    count: number;
    hasNextPage: boolean;
  };
};

const Pagination = ({
  pagination,
  onPagination,
  paginatedMetadata,
}: PaginationProps) => {
  const startOffest = pagination.page * pagination.size + 1;
  const endOffest = startOffest + pagination.size - 1;
  const actualEndOffset = Math.min(endOffest, paginatedMetadata.count);

  const label = `${startOffest} - ${actualEndOffset} of ${paginatedMetadata.count}`;

  const handleNextPage = () => {
    onPagination({ ...pagination, page: pagination.page + 1 });
  };
  const handlePreviousPage = () => {
    onPagination({ ...pagination, page: pagination.page - 1 });
  };

  const nextButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={handleNextPage}
      disabled={!paginatedMetadata.hasNextPage}
    >
      Next
    </Button>
  );

  const previousButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePreviousPage}
      disabled={pagination.page < 1}
    >
      Previous
    </Button>
  );

  return (
    <div className="flex justify-between items-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex gap-x-1">
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
};

export default Pagination;

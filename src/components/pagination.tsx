import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleChangeSize = (newSize: string) => {
    onPagination({ page: 0, size: parseInt(newSize) });
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

  const sizeButton = (
    <Select value={pagination.size.toString()} onValueChange={handleChangeSize}>
      <SelectTrigger className="w-[60px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-x-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span>{sizeButton}</span>
      </div>
      <div className="flex items-center gap-x-1">
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
};

export default Pagination;

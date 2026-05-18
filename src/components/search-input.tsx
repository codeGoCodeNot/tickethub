"use client";

import { searchParser } from "@/features/ticket/search-params";
import { LucideSearch } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";

type SearchInputProps = {
  placeholder: string;
};

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    250,
  );

  return (
    <div className="relative flex-1">
      <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        defaultValue={search}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchInput;

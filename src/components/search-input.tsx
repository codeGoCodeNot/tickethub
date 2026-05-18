"use client";

import { LucideSearch } from "lucide-react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";
import { useDebouncedCallback } from "use-debounce";

type SearchInputProps = {
  placeholder: string;
};

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      replace(`${pathname}?${params.toString()}` as Route, {
        scroll: false,
      });
    },
    250,
  );

  return (
    <div className="relative">
      <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchInput;

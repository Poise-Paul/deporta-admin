"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { getStaffList } from "@/api/user";
import { DriverBusData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PAGE_SIZE = 20;

interface DriverMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  // Already-populated drivers (e.g. bus.drivers_assigned) so selected badges
  // can show names even when that driver isn't in the loaded page.
  knownDrivers?: DriverBusData[];
  // Reports the full driver objects for the current selection.
  onSelectedDriversChange?: (drivers: DriverBusData[]) => void;
}

export function DriverMultiSelect({
  value,
  onChange,
  knownDrivers,
  onSelectedDriversChange,
}: DriverMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [driverCache, setDriverCache] = useState<Record<string, DriverBusData>>(
    {},
  );
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["drivers-select", debouncedSearch],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getStaffList(pageParam, PAGE_SIZE, debouncedSearch, undefined, "driver"),
      getNextPageParam: (last) => {
        const { page, totalPages } = last.staffs.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      enabled: open,
    });

  const drivers = useMemo(
    () =>
      (data?.pages ?? [])
        .flatMap((p) => p.staffs.data)
        .filter((d) => d.user_type?.type_id?.role === "driver"),
    [data],
  );

  // Remember every driver we've seen so labels survive search/page changes.
  useEffect(() => {
    const seen = [...(knownDrivers ?? []), ...drivers];
    if (seen.length === 0) return;
    setDriverCache((prev) => {
      const next = { ...prev };
      seen.forEach((d) => {
        next[d._id] = {
          _id: d._id,
          first_name: d.first_name,
          last_name: d.last_name,
          profile_image: d.profile_image,
        };
      });
      return next;
    });
  }, [knownDrivers, drivers]);

  const selectedIds = value.filter((id) => id !== "");

  useEffect(() => {
    onSelectedDriversChange?.(
      selectedIds
        .map((id) => driverCache[id])
        .filter((d): d is DriverBusData => Boolean(d)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, driverCache]);

  const options = drivers.filter((d) => !selectedIds.includes(d._id));

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      fetchNextPage();
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="border-input flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
          >
            <span className="text-muted-foreground">Add a driver...</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-0"
        >
          <div className="relative border-b p-2">
            <Search className="text-muted-foreground absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drivers by name..."
              className="pl-8"
            />
          </div>
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-64 overflow-y-auto p-1"
          >
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : options.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No drivers found
              </p>
            ) : (
              options.map((driver) => (
                <button
                  key={driver._id}
                  type="button"
                  onClick={() => onChange([...selectedIds, driver._id])}
                  className="hover:bg-accent w-full rounded-sm px-2 py-1.5 text-left text-sm"
                >
                  {driver.first_name} {driver.last_name}
                </button>
              ))
            )}
            {hasNextPage && !isLoading && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-muted-foreground hover:text-foreground flex w-full justify-center py-2 text-xs"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Load more"
                )}
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Drivers */}
      <div className="flex flex-wrap gap-2">
        {selectedIds.map((driverId) => {
          const driver = driverCache[driverId];
          return (
            <Badge
              key={driverId}
              variant="secondary"
              className="pl-2 pr-1 py-1"
            >
              {driver
                ? `${driver.first_name} ${driver.last_name}`
                : "Loading..."}
              <button
                type="button"
                onClick={() =>
                  onChange(selectedIds.filter((id) => id !== driverId))
                }
                className="ml-2 hover:bg-destructive hover:text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquareOff, Star, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { getDriverReviews, useDeleteReview } from "@/api/reviews";
import { DriverReview } from "@/types";

const PAGE_SIZE = 10;

function StarRating({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className={cn("relative inline-block", size)}>
            <Star className={cn("absolute inset-0 text-gray-300", size)} />
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn("text-amber-400 fill-amber-400", size)} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// The reviewer is a bare id today; use name/avatar if the backend populates it.
const reviewerOf = (review: DriverReview) => {
  const u = review.user_id;
  if (u && typeof u === "object" && (u.first_name || u.last_name)) {
    return {
      name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
      image: u.profile_image,
    };
  }
  return { name: "Customer", image: undefined };
};

export function DriverReviews({ driverId }: { driverId: string }) {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<DriverReview | null>(null);
  const deleteReview = useDeleteReview();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["driver-reviews", driverId, page],
    queryFn: () => getDriverReviews(driverId, page, PAGE_SIZE),
    enabled: !!driverId,
    retry: false,
  });

  const reviews = data?.reviews.data ?? [];
  const totalPages = data?.reviews.pagination.totalPages || 1;
  const total = data?.total ?? 0;
  const average = Number(data?.average_stars ?? 0);

  // After deleting the last review on a page, step back to a page that exists.
  useEffect(() => {
    if (!isFetching && page > 1 && reviews.length === 0) {
      setPage((p) => Math.max(1, Math.min(p - 1, totalPages)));
    }
  }, [isFetching, page, reviews.length, totalPages]);

  // Reset paging when switching drivers.
  useEffect(() => setPage(1), [driverId]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteReview.mutate(deleteTarget._id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        {isLoading ? (
          <Skeleton className="h-16 w-56" />
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-4xl font-bold">{average.toFixed(1)}</p>
            <div className="space-y-1">
              <StarRating value={average} size="h-5 w-5" />
              <p className="text-sm text-muted-foreground">
                Based on {total} review{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}

        {/* List */}
        <div className="divide-y divide-border border-t border-border">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="py-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          ) : isError ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Couldn&apos;t load reviews. Please try again.
            </p>
          ) : reviews.length === 0 ? (
            <div className="py-10 flex flex-col items-center text-center">
              <MessageSquareOff className="h-8 w-8 text-muted-foreground opacity-50 mb-3" />
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                Reviews from customers will show up here.
              </p>
            </div>
          ) : (
            reviews.map((review) => {
              const reviewer = reviewerOf(review);
              return (
                <div key={review._id} className="py-4 flex gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={reviewer.image} />
                    <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm font-medium">{reviewer.name}</span>
                      <StarRating value={Number(review.stars) || 0} />
                    </div>
                    <p className="text-sm">{review.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleString()}
                      {review.trip_id && (
                        <> · Trip #{review.trip_id.slice(-6).toUpperCase()}</>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => setDeleteTarget(review)}
                    aria-label="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {"<"}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  page === p
                    ? "bg-[#0A1942] text-white hover:bg-[#0A1942]/90"
                    : "text-muted-foreground",
                )}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {">"}
            </Button>
          </div>
        )}
      </CardContent>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && !deleteReview.isPending && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget &&
                `"${deleteTarget.message}" will be permanently removed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteReview.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                // Keep the dialog open until the delete finishes.
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteReview.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteReview.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleteReview.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

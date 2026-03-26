import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Assuming Shadcn UI
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { getAdminTransactions } from "@/api/dashboard";

const DashboardTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // get the current user
  const { data, error, refetch, isRefetching, isFetching, isLoading } =
    useQuery({
      queryKey: ["transactions", currentPage],
      retry: false,
      queryFn: () => getAdminTransactions(currentPage, 10),
    });

  const transactions = data?.transaction?.data || [];
  const pagination = data?.transaction?.pagination || {
    page: 1,
    totalPages: 1,
  };
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formatters
  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatType = (type: string) =>
    type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleViewDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  // Table Loader
  const TableRowSkeleton = () => (
    <tr className="border-b border-border animate-pulse">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-8 w-8 rounded-md" />
      </td>
    </tr>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Transactions
        </h2>
        {/* View All Hidden */}
        {/* <Button variant="outline" size="sm">
          View All
        </Button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 font-medium">Transaction ID</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </>
            ) : (
              transactions?.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[120px]">
                    {tx._id}
                  </td>
                  <td className="px-6 py-4">{formatType(tx.type)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4">{formatDate(tx.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                        tx.status === "successful"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleViewDetail(tx)}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && transactions?.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-muted-foreground"
                >
                  No Transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing Page <span className="font-medium">{pagination.page}</span> of{" "}
          <span className="font-medium">{pagination.totalPages}</span>
        </span>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isFetching}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === pagination.totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(selectedTx.amount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                      selectedTx.status === "successful"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedTx.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Transaction Type</p>
                  <p className="font-medium text-gray-900">
                    {formatType(selectedTx.type)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-medium text-gray-900 truncate pr-2">
                    {selectedTx._id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">User ID</p>
                  <p className="font-medium text-gray-900 truncate pr-2">
                    {selectedTx.user_id}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedTx.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardTransactions;

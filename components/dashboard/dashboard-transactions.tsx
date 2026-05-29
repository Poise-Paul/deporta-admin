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
import { getAdminTransactionById, getAdminTransactions } from "@/api/dashboard";

const DashboardTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["transactions", currentPage],
    retry: false,
    queryFn: () => getAdminTransactions(currentPage, 10),
  });

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["transaction-detail", selectedId],
    queryFn: () => getAdminTransactionById(selectedId!),
    enabled: !!selectedId,
  });

  const transactions = data?.transaction?.data || [];
  const pagination = data?.transaction?.pagination || {
    page: 1,
    totalPages: 1,
  };
  const detail = detailData?.transaction;

  const formatCurrency = (amount: number) => `₦${amount?.toLocaleString()}`;
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatType = (type: string) =>
    type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleViewDetail = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const statusColors: Record<string, string> = {
    successful: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    canceled: "bg-red-100 text-red-700",
  };

  const TableRowSkeleton = () => (
    <tr className="border-b border-border animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>
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
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No Transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                          statusColors[tx.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetail(tx._id)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing Page <span className="font-medium">{pagination.page}</span>{" "}
            of <span className="font-medium">{pagination.totalPages}</span>
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
      </div>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="space-y-3 pt-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : detail ? (
            <div className="space-y-5 pt-2">
              {/* Amount + Status Hero */}
              <div className="flex items-center justify-between bg-orange-50 rounded-xl px-5 py-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(detail.amount)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${
                    statusColors[detail.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {detail.status}
                </span>
              </div>

              {/* Transaction Meta */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
                  <p className="text-xs font-mono font-medium text-gray-800 break-all">
                    {detail._id}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1">Type</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {formatType(detail.type)}
                  </p>
                </div>
                <div className="col-span-2 rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(detail.createdAt)}
                  </p>
                </div>
              </div>

              {/* Customer */}
              {detail.user_id && typeof detail.user_id === "object" && (
                <div className="rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    {detail.user_id.profile_image ? (
                      <img
                        src={detail.user_id.profile_image}
                        alt="Customer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-lg">
                          {detail.user_id.first_name?.[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Customer
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {detail.user_id.first_name} {detail.user_id.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detail.user_id.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detail.user_id.phone_number}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize shrink-0 ${
                      detail.user_id.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {detail.user_id.status}
                  </span>
                </div>
              )}

              {/* Virtual Account if present */}
              {detail.user_id?.user_type?.type_id?.paystack_virtual_account && (
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Virtual Account
                  </p>
                  {(() => {
                    const va =
                      detail.user_id.user_type.type_id.paystack_virtual_account;
                    return (
                      <div className="flex gap-6 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">Bank</p>
                          <p className="font-semibold text-gray-800">
                            {va.bank?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">
                            Account Number
                          </p>
                          <p className="font-mono font-semibold text-gray-800">
                            {va.account_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Currency</p>
                          <p className="font-semibold text-gray-800">
                            {va.currency}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Timestamps */}
              <div className="flex gap-6 text-xs text-gray-400 pt-1 border-t border-gray-100">
                <div>
                  <span className="block">Created</span>
                  <span className="text-gray-600">
                    {formatDate(detail.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="block">Updated</span>
                  <span className="text-gray-600">
                    {formatDate(detail.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardTransactions;

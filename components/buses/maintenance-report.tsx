"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MaintenancePayload,
  MaintenanceStatusType,
  PriorityType,
} from "@/types";
import { getMaintenanceReports, useCreateReport } from "@/api/buses";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceDetailSheet } from "./side-reports";

interface MaintenanceReportProps {
  busId: string;
}

export function MaintenanceReport({ busId }: MaintenanceReportProps) {
  const { selBus } = useSelector((state: RootState) => state.bus);

  const [holdBtn, setHoldBtn] = useState(true);

  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  const [selectedReport, setSelectedReport] =
    useState<MaintenancePayload | null>(null);

  const { register, setValue, watch, reset } = useForm<MaintenancePayload>({
    values: {
      bus_id: selBus?._id || "",
      priority: PriorityType.Normal,
      status: MaintenanceStatusType.Pending,
      report: {
        title: "",
        description: "",
        technician_notes: "",
      },
    },
  });

  const handleWatchMaintenance = watch();

  const mutationReport = useCreateReport();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data, refetch, isLoading } = useQuery({
      // ✅ Adding parameters to the key ensures refetching on change
      queryKey: ["maintenanceReports", currentPage, itemsPerPage],
      queryFn: () => getMaintenanceReports(currentPage, itemsPerPage),
    });

    // Extract pagination info safely from your MaintenanceReportResponse
    const pagination = data?.maintenance_report?.pagination;
    const totalPages = pagination?.totalPages || 1;


  const handleMutationReport = () => {
    const currentData = watch();

    // Basic validation
    if (!currentData.bus_id) {
      toast.error("No bus selected for report");
      return;
    }

    mutationReport.mutate(currentData, {
      onSuccess: () => {
        reset();
        refetch()
        setIsMaintenanceOpen(false);
      },
    });
  };

  useEffect(() => {
    const currentReport = handleWatchMaintenance.report;

    const isFormValid =
      !!currentReport?.title &&
      !!currentReport?.description &&
      !!currentReport?.technician_notes &&
      !!handleWatchMaintenance.priority;

    setHoldBtn(!isFormValid);
  }, [handleWatchMaintenance]);


  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-lg font-semibold text-primary">
          Maintenance Report
        </CardTitle>

        <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4" />
              Create New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bus Maintenance Report</DialogTitle>
              <DialogDescription>
                Record repair details and costs for this vehicle.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="space-y-4 py-4">
              <div className="grid gap-5 w-full grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Service Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                  // onValueChange={(value) => setValue("report.title", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type of service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Routine Checkup">
                        Routine Checkup
                      </SelectItem>
                      <SelectItem value="Engine Maintenance">
                        Engine Maintenance
                      </SelectItem>
                      <SelectItem value="Tire Replacement">
                        Tire Replacement
                      </SelectItem>
                      <SelectItem value="Brake Repair">Brake Repair</SelectItem>
                      <SelectItem value="Electrical Fix">
                        Electrical Fix
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 w-full">
                  <Label>
                    Priority <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    defaultValue={PriorityType.Normal}
                    onValueChange={(value) =>
                      // Cast the string to the PriorityType Enum
                      setValue("priority", value as PriorityType)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Set Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PriorityType.Normal}>
                        Normal
                      </SelectItem>
                      <SelectItem value={PriorityType.High}>High</SelectItem>
                      <SelectItem value={PriorityType.Urgent}>
                        Urgent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 gap-4 flex-col flex">
                <div className="space-y-2">
                  <Label>
                    Maintenance Title
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    {...register("report.title")}
                    placeholder="Enter the title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Maintenance Description{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    {...register("report.description")}
                    placeholder="What exactly is being fixed?"
                    className="min-h-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Cost (₦)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label>Workshop / Technician</Label>

                  <Input
                    placeholder="e.g. Lekki Auto Center"
                    {...register("report.technician_notes")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup
                    defaultValue={MaintenanceStatusType.Pending}
                    onValueChange={(val) =>
                      // Cast the string to the Enum type
                      setValue("status", val as MaintenanceStatusType)
                    }
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={MaintenanceStatusType.Pending}
                        id="m1"
                      />
                      <Label htmlFor="m1" className="text-xs">
                        Pending
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={MaintenanceStatusType.Completed}
                        id="m2"
                      />
                      <Label htmlFor="m2" className="text-xs">
                        Completed
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button
                disabled={mutationReport.isPending || holdBtn}
                onClick={handleMutationReport}
                className={`w-full bg-primary ${holdBtn && "opacity-30"} hover:bg-primary/90 text-primary-foreground mt-4`}
              >
                {mutationReport.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Submit Maintenance Report</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Report
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Staff
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Priority
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Others
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.maintenance_report.data.map((report) => (
                <tr
                  key={report._id}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="font-medium text-sm">{report.report.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {report.report.description}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          className="object-cover"
                          src={
                            report.added_by.profile_image || "/placeholder.svg"
                          }
                          alt={report.added_by.first_name}
                        />
                        <AvatarFallback>
                          {report.added_by.first_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {report.added_by.first_name} {report.added_by.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        report.status === "completed"
                          ? "border-green-500 text-green-600"
                          : "border-orange-500 text-orange-600",
                      )}
                    >
                      {report.status === "completed" ? "Completed" : "Pending"}{" "}
                      •
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        report.priority === "urgent" && "text-red-600",
                        report.priority === "high" && "text-orange-600",
                        report.priority === "normal" && "text-foreground",
                      )}
                    >
                      {report.priority.charAt(0).toUpperCase() +
                        report.priority.slice(1)}{" "}
                      {report.priority === "urgent" && "•"}
                      {report.priority === "high" && "•"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedReport(report)}
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Show
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-sm bg-background"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            per page
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              {"<"}
            </Button>

            {/* Dynamic Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    currentPage === pageNumber
                      ? "bg-[#0A1942] text-white hover:bg-[#0A1942]/90" // Matches your dark blue style
                      : "text-muted-foreground",
                  )}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              {">"}
            </Button>
          </div>
        </div>
      </CardContent>

      <MaintenanceDetailSheet
        report={selectedReport}
        isOpen={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      />
    </Card>
  );
}

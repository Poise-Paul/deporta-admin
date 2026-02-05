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
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
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
import { useCreateReport } from "@/api/buses";
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

interface MaintenanceReportProps {
  busId: string;
}

const reports = [
  {
    id: 1,
    date: "10/08/2025 | 8:30 Am",
    title: "Engine Warning Light (Oil Pressure)",
    description:
      "Driver reported an illuminated red oil pressure warning light during the morning route (Route AJAH-EB) today, 11/20. They pulled over safely. The engine sounds rougher than usual at low RPMs...",
    staff: {
      name: "Fashina Simisola",
      avatar: "/diverse-woman-smiling.png",
    },
    status: "pending",
    priority: "urgent",
  },
  {
    id: 2,
    date: "10/08/2025 | 8:30 Am",
    title: "Cabin AC Not Cooling",
    description:
      "Driver reported that the main passenger cabin AC unit stopped blowing cold air entirely during the 3 PM route...",
    staff: {
      name: "Olayinka Badamosi",
      avatar: "/african-man-professional.png",
    },
    status: "completed",
    priority: "high",
  },
  {
    id: 3,
    date: "10/08/2025 | 8:30 Am",
    title: "Passenger Side Mirror Cracked",
    description:
      "Noted during the pre-shift inspection: the passenger-side rearview mirror casing is cracked and the glass is loose. It is currently taped for temporary safety but requires immediate replacement before the next route. Action Required: Replace entire mirror assembly.",
    staff: {
      name: "Demisire Oluwatobi",
      avatar: "/young-man-casual.jpg",
    },
    status: "completed",
    priority: "normal",
  },
  {
    id: 4,
    date: "10/08/2025 | 8:30 Am",
    title: "Front Brake Pads Worn",
    description:
      "The driver reported a persistent squealing sound during braking, particularly at low speeds. Technician performed an inspection and confirmed that the front brake pads are worn down to 2mm (replacement threshold is 3mm)...",
    staff: {
      name: "Olayinka Badamosi",
      avatar: "/african-man-professional.png",
    },
    status: "completed",
    priority: "low",
  },
];

export function MaintenanceReport({ busId }: MaintenanceReportProps) {
  const { selBus } = useSelector((state: RootState) => state.bus);

  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  const {
    register: registerMaintenance,
    setValue: setValueMaintenance,
    watch: watchMaintenance,
    reset: resetMaintenance,
  } = useForm<MaintenancePayload>({
    // Use 'values' instead of 'defaultValues' to keep the bus_id in sync
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

  const handleWatchMaintenance = watchMaintenance();

  const {
    report,
    bus_id,
    priority,
    status: maintenanceStatus,
  } = handleWatchMaintenance;

  const mutationReport = useCreateReport();

  const handleMutationReport = () => {
    const currentData = watchMaintenance();

    // Basic validation
    if (!currentData.bus_id) {
      toast.error("No bus selected for report");
      return;
    }

    mutationReport.mutate(currentData, {
      onSuccess: () => {
        resetMaintenance();
        setIsMaintenanceOpen(false);
        toast.success("Maintenance report submitted");
      },
    });
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-lg font-semibold text-primary">
          Maintenance Report
        </CardTitle>

        <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Plus className="h-4 w-4" />
              Create New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <div className="space-y-4 py-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-medium">Bus Maintenance Report</h3>
                <p className="text-xs text-muted-foreground">
                  Record repair details and costs for this vehicle.
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Service Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValueMaintenance("report.title", value)
                    }
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label>
                    Priority <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    defaultValue={PriorityType.Normal}
                    onValueChange={(value) =>
                      // Cast the string to the PriorityType Enum
                      setValueMaintenance("priority", value as PriorityType)
                    }
                  >
                    <SelectTrigger>
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

              <div className="space-y-2">
                <Label>
                  Maintenance Description{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  {...registerMaintenance("report.description")}
                  placeholder="What exactly is being fixed?"
                  className="min-h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Cost (₦)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    onChange={(e) => {
                      const currentNotes =
                        watchMaintenance("report.technician_notes") || "";
                      setValueMaintenance(
                        "report.technician_notes",
                        `Cost: ₦${e.target.value} | ${currentNotes}`,
                      );
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Workshop / Technician</Label>
                  <Input
                    placeholder="e.g. Lekki Auto Center"
                    onChange={(e) => {
                      const currentNotes =
                        watchMaintenance("report.technician_notes") || "";
                      setValueMaintenance(
                        "report.technician_notes",
                        `${currentNotes} | Workshop: ${e.target.value}`,
                      );
                    }}
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
                      setValueMaintenance(
                        "status",
                        val as MaintenanceStatusType,
                      )
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
                disabled={mutationReport.isPending}
                onClick={handleMutationReport}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
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
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                    {report.date}
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {report.description}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={report.staff.avatar || "/placeholder.svg"}
                          alt={report.staff.name}
                        />
                        <AvatarFallback>
                          {report.staff.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{report.staff.name}</span>
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
                        report.priority === "low" && "text-muted-foreground",
                      )}
                    >
                      {report.priority.charAt(0).toUpperCase() +
                        report.priority.slice(1)}{" "}
                      {report.priority === "urgent" && "•"}
                      {report.priority === "high" && "•"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Show
            <select className="border border-border rounded px-2 py-1 text-sm bg-background">
              <option>4 of 8</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 - Page</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                {"<"}
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                2
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {">"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

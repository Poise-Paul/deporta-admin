import {
  FileText,
  Wrench,
  Clock,
  AlertCircle,
  Calendar,
  Hash,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

export const MaintenanceDetailSheet = ({
  report,
  isOpen,
  onOpenChange,
}: any) => {
  const isUrgent = report?.priority === "urgent";
  const isCompleted = report?.status === "completed";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-0 border-l">
        {/* Status Indicator Bar */}
        <div
          className={`h-1.5 w-full ${isUrgent ? "bg-destructive" : "bg-primary"}`}
        />

        <div className="p-6">
          <SheetHeader className="space-y-1">
            <div className="flex justify-between items-start">
              <Badge
                variant={isCompleted ? "default" : "secondary"}
                className={cn(
                  "capitalize mb-2 shadow-sm",
                  isCompleted &&
                    "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent",
                  report?.status === "pending" &&
                    "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
                )}
              >
                {report?.status}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span className="text-xs font-mono uppercase">
                  {report?._id.slice(-6)}
                </span>
              </div>
            </div>
            <SheetTitle className="text-2xl font-bold tracking-tight">
              {report?.report.title}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border">
              <div className="bg-background p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Priority
                  </span>
                </div>
                <p
                  className={`text-sm font-semibold capitalize ${isUrgent ? "text-destructive" : "text-foreground"}`}
                >
                  {report?.priority}
                </p>
              </div>
              <div className="bg-background p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Date Logged
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {report?.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Description Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-foreground/80">
                  Problem Description
                </h4>
              </div>
              <div className="relative group">
                <div className="p-4 rounded-xl border bg-muted/5 text-sm leading-relaxed shadow-sm">
                  {report?.report.description}
                </div>
              </div>
            </section>

            {/* Technician Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-500/10">
                  <Wrench className="h-4 w-4 text-amber-600" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-foreground/80">
                  Workshop & Technical Notes
                </h4>
              </div>
              <div className="p-4 rounded-xl border-2 border-dashed border-muted bg-muted/20">
                {report?.report.technician_notes ? (
                  <p className="text-sm italic text-foreground/80 leading-relaxed">
                    "{report.report.technician_notes}"
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                    No technician notes recorded yet.
                  </p>
                )}
              </div>
            </section>

            {/* Action Area */}
            <div className="pt-8 space-y-3">
              {!isCompleted && (
                <Button
                  className="w-full gap-2 shadow-lg shadow-primary/20 h-11"
                  size="lg"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Resolved
                </Button>
              )}
              <Button variant="outline" className="w-full gap-2 h-11" size="lg">
                <Download className="h-4 w-4" />
                Export Report PDF
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

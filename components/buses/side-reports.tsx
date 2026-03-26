import {
  FileText,
  Wrench,
  Clock,
  AlertCircle,
  Calendar,
  Hash,
  Download,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { useMaintenanceUpdate } from "@/api/buses";
import { MaintenanceStatusType } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

export const MaintenanceDetailSheet = ({
  report,
  isOpen,
  onOpenChange,
}: any) => {
  const queryClient = useQueryClient();
  const isUrgent = report?.priority === "urgent";
  const isCompleted = report?.status === "completed";

  // 1. Setup the Mutation for Marking as Resolved

  const editMaintenanceReport = useMaintenanceUpdate();

  const handleMaintenanceReport = () => {
    editMaintenanceReport.mutate(
      {
        maintenance_report_id: report._id,
        bus_id: report.bus_id,
        priority: report.priority,
        status: MaintenanceStatusType.Completed,
        report: {
          title: report.report.title,
          description: report.report.description,
          technician_notes: report.report.technician_notes || "",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["maintenanceReports"] });
          onOpenChange(false);
        },
      },
    );
  };

  // 2. Setup the PDF Generator
  const handleExportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const margin = 20;
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(10, 25, 66); // Dark blue text
    doc.text("Maintenance Report", margin, yPos);

    // Metadata block
    yPos += 15;
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100); // Gray text
    doc.text(`Report ID: ${report._id}`, margin, yPos);
    yPos += 8;
    doc.text(
      `Date Logged: ${new Date(report.createdAt).toLocaleDateString()}`,
      margin,
      yPos,
    );
    yPos += 8;
    doc.text(`Priority: ${report.priority.toUpperCase()}`, margin, yPos);
    yPos += 8;
    doc.text(`Status: ${report.status.toUpperCase()}`, margin, yPos);
    yPos += 8;
    doc.text(
      `Reported By: ${report.added_by.first_name} ${report.added_by.last_name}`,
      margin,
      yPos,
    );

    // Title
    yPos += 15;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Title:", margin, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    // Word wrap the title
    const titleLines = doc.splitTextToSize(report.report.title, 170);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 7;

    // Description
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Description:", margin, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    // Word wrap the description to fit page width
    const descLines = doc.splitTextToSize(report.report.description, 170);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 7;

    // Technician Notes
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Technician Notes:", margin, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    const notes =
      report.report.technician_notes || "No technician notes provided.";
    const noteLines = doc.splitTextToSize(notes, 170);
    doc.text(noteLines, margin, yPos);

    // Save the PDF with a dynamic name
    doc.save(`Deporta_Maintenance_${report._id.slice(-6)}.pdf`);
  };

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
                  onClick={handleMaintenanceReport}
                  disabled={editMaintenanceReport.isPending}
                  className="w-full gap-2 shadow-lg shadow-primary/20 h-11"
                  size="lg"
                >
                  {editMaintenanceReport.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {editMaintenanceReport.isPending
                    ? "Updating..."
                    : "Mark as Resolved"}
                </Button>
              )}
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="w-full gap-2 h-11"
                size="lg"
              >
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

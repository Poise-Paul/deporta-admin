import {
  Bus,
  Users,
  MapPin,
  Gauge,
  Fuel,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Map as MapIcon,
  Settings2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

export const VehicleDetailSheet = ({ bus, isOpen, onOpenChange }: any) => {
  if (!bus) return null;

  const isActive = bus.status === "active";
  const isMaintenance = bus.is_maintenance;
  const isOutsourced = bus.outsourcing;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0 flex flex-col h-full border-l-0 shadow-2xl">
        <ScrollArea className="flex-1">
          {/* 1. Dynamic Hero Section */}
          <div className="relative h-64 bg-slate-900 overflow-hidden">
            <img
              src={bus.bus_photos[0]}
              className="w-full h-full object-cover opacity-80"
              alt="Vehicle"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

            {/* Floating Status Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge
                className={
                  isActive ? "bg-emerald-500/90 text-white" : "bg-slate-500/90"
                }
              >
                {isActive ? "LIVE" : "INACTIVE"}
              </Badge>
              {isOutsourced && (
                <Badge className="bg-blue-500/90 text-white border-0">
                  OUTSOURCED
                </Badge>
              )}
            </div>

            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-white text-3xl font-bold tracking-tight">
                {bus.name_label}
              </h2>
              <div className="flex items-center gap-2 text-slate-300 font-mono text-sm mt-1">
                <span className="bg-white/10 px-2 py-0.5 rounded text-white">
                  {bus.id_code}
                </span>
                <span className="opacity-50">|</span>
                <span>{bus.plate_number}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* 2. Operational Health Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-4 rounded-2xl border flex flex-col gap-1 ${bus.is_on_site ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"}`}
              >
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Presence
                  {bus.is_on_site ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-rose-600" />
                  )}
                </div>
                <span
                  className={`text-lg font-bold ${bus.is_on_site ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {bus.is_on_site ? "On Site" : "Off Site"}
                </span>
              </div>

              <div
                className={`p-4 rounded-2xl border flex flex-col gap-1 ${!isMaintenance ? "bg-blue-50/50 border-blue-100" : "bg-amber-50/50 border-amber-100"}`}
              >
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Health
                  <ShieldCheck
                    className={`h-3 w-3 ${!isMaintenance ? "text-blue-600" : "text-amber-600"}`}
                  />
                </div>
                <span
                  className={`text-lg font-bold ${!isMaintenance ? "text-blue-700" : "text-amber-700"}`}
                >
                  {isMaintenance ? "Maintenance" : "Optimal"}
                </span>
              </div>
            </div>

            {/* 3. Technical Specifications (Dark Grid) */}
            <div className="bg-[#0A1942] text-white rounded-2xl p-5 grid grid-cols-3 gap-6 shadow-xl shadow-blue-900/10">
              <div className="space-y-1">
                <Users className="h-4 w-4 text-blue-400" />
                <p className="text-[10px] text-blue-200/60 uppercase font-bold">
                  Capacity
                </p>
                <p className="text-xl font-bold">{bus.capacity}</p>
              </div>
              <div className="space-y-1 border-x border-white/10 px-4">
                <Fuel className="h-4 w-4 text-blue-400" />
                <p className="text-[10px] text-blue-200/60 uppercase font-bold">
                  Fuel
                </p>
                <p className="text-xl font-bold capitalize">{bus.fuel_type}</p>
              </div>
              <div className="space-y-1 pl-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <p className="text-[10px] text-blue-200/60 uppercase font-bold">
                  Mileage
                </p>
                <p className="text-xl font-bold">
                  {Math.round(Number(bus.mileage) / 1000)}k
                </p>
              </div>
            </div>

            {/* 4. Active Crew */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Assigned Drivers
                </h4>
                <span className="text-xs text-muted-foreground">
                  {bus.drivers_assigned.length} Active Drivers
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {bus.drivers_assigned.map((driver: any) => (
                  <div
                    key={driver._id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-muted hover:border-primary/50 transition-colors group"
                  >
                    <Avatar className="h-10 w-10 border group-hover:border-primary">
                      <AvatarImage src={driver.profile_image} />
                      <AvatarFallback className="bg-slate-100">
                        {driver.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-bold">
                        {driver.first_name} {driver.last_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        Primary Operator
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Routes & Scheduling */}
            <section className="bg-slate-50 rounded-2xl p-5 border space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border shadow-sm">
                  <MapIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                    Routes Assigned
                  </p>
                  <p className="font-bold text-slate-900">
                    {bus.routes_assigned[0]?.code || "Awaiting Deployment"}
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-200/60" />

              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border shadow-sm">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                    Active Window
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold">
                      {new Date(bus.operation_schedule.from).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </span>
                    <div className="h-1 w-4 bg-slate-300 rounded-full" />
                    <span className="font-bold">
                      {new Date(bus.operation_schedule.to).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* 6. Footer Actions */}
        <div className="p-4 border-t bg-white flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12 font-bold border-2"
          >
            Track Bus
          </Button>
          <Button className="flex-1 bg-[#0A1942] hover:bg-[#0A1942]/90 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-900/20">
            Manage Fleet
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

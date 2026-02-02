"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { addDays, format } from "date-fns"; // Useful for formatting
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

("recharts");

const data = [
  { month: "Jan", value: 100000 },
  { month: "Feb", value: 150000 },
  { month: "Mar", value: 180000 },
  { month: "Apr", value: 160000 },
  { month: "May", value: 200000 },
  { month: "Jun", value: 280000 },
  { month: "Jul", value: 235000 },
  { month: "Aug", value: 190000 },
  { month: "Sep", value: 220000 },
  { month: "Oct", value: 250000 },
  { month: "Nov", value: 280000 },
  { month: "Dec", value: 300000 },
];

export function DashboardAnalytics() {
  // 1. Initialize Date State
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2026, 0, 18),
    to: addDays(new Date(2026, 0, 18), 180),
  });
  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Analytics</CardTitle>
        {/* Popover here */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground bg-transparent"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              pagedNavigation
            />
          </PopoverContent>
        </Popover>
        {/* End PopOver */}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA6A12" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#EA6A12" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e5e5"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
                tickFormatter={(value) => `₦${value / 1000}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                formatter={(value: number) => [
                  `₦${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#EA6A12"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

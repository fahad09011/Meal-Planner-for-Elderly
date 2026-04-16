import { startOfWeek, endOfWeek, format } from "date-fns";

export const getWeekStartDate = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  return format(weekStart, "yyyy-MM-dd");
};


export const getWeekLastDate = () => {
  const today = new Date();
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  return format(weekEnd, "yyyy-MM-dd");
};
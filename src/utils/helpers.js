import { startOfWeek , format} from "date-fns";
export const getWeekStartDate = ()=>{
const today = new Date("2026-03-23");
const weekStart = startOfWeek(today, {weekStartsOn:1});
const formattedWeekStart = format(weekStart, "yyyy-MM-dd");
return formattedWeekStart;
};

export const getWeekLastDate = ()=>{
const today = new Date("2026-03-23");
const weekEnd = startOfWeek(today, {weekStartsOn:1});

const formattedWeekEnd = format(weekEnd, "yyyy-MM-dd");
return formattedWeekEnd;
};
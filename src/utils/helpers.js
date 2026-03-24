import { startOfWeek , format} from "date-fns";
export const getWeekStartDate = ()=>{
const today = new Date();
const weekStart = startOfWeek(today, {weekStartsOn:1});
const formattedWeekStart = format(weekStart, "yyyy-MM-dd");
// console.log("formattedWeekStart", formattedWeekStart);
return formattedWeekStart;
};

export const getWeekLastDate = ()=>{
const today = new Date();
const weekEnd = startOfWeek(today, {weekStartsOn:1});

const formattedWeekEnd = format(weekEnd, "yyyy-MM-dd");
// console.log("formattedWeekEnd", formattedWeekEnd);
return formattedWeekEnd;
};
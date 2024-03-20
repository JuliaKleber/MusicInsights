import { Month } from "../types/types";

export const parsedReleaseDate: (releaseDate: string | undefined) => string = (releaseDate: string | undefined) => {
  if (releaseDate === undefined) return "N/A";
  const month: Month = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };
  return releaseDate.length === 4
    ? releaseDate
    : releaseDate.slice(-2) +
        " " +
        month[releaseDate.slice(5, 7)] +
        " " +
        releaseDate.slice(0, 4);
};

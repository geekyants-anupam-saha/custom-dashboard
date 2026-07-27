export type DateRangeType =
  | "lastWeek"
  | "lastMonth"
  | "lastQuarter"
  | "lastYear"
  | "custom";

export interface DateRangeOption {
  key: DateRangeType;
  label: string;
  startDate: string;
  endDate: string;
  displayRange: string;
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toIso(date: Date) {
  return date.toISOString();
}

export function getPresetRanges(): DateRangeOption[] {
  const today = new Date();

  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - 7);

  const lastMonthStart = new Date(today);
  lastMonthStart.setMonth(today.getMonth() - 1);

  const lastQuarterStart = new Date(today);
  lastQuarterStart.setMonth(today.getMonth() - 3);

  const lastYearStart = new Date(today);
  lastYearStart.setFullYear(today.getFullYear() - 1);

  return [
    {
      key: "lastWeek",
      label: "Last Week",
      startDate: toIso(lastWeekStart),
      endDate: toIso(today),
      displayRange: `${formatDisplayDate(lastWeekStart)} - ${formatDisplayDate(
        today,
      )}`,
    },
    {
      key: "lastMonth",
      label: "Last Month",
      startDate: toIso(lastMonthStart),
      endDate: toIso(today),
      displayRange: `${formatDisplayDate(
        lastMonthStart,
      )} - ${formatDisplayDate(today)}`,
    },
    {
      key: "lastQuarter",
      label: "Last Quarter",
      startDate: toIso(lastQuarterStart),
      endDate: toIso(today),
      displayRange: `${formatDisplayDate(
        lastQuarterStart,
      )} - ${formatDisplayDate(today)}`,
    },
    {
      key: "lastYear",
      label: "Last Year",
      startDate: toIso(lastYearStart),
      endDate: toIso(today),
      displayRange: `${formatDisplayDate(
        lastYearStart,
      )} - ${formatDisplayDate(today)}`,
    },
    {
      key: "custom",
      label: "Custom Range",
      startDate: "",
      endDate: "",
      displayRange: "",
    },
  ];
}

export function getRangeByKey(key?: string) {
  return (
    getPresetRanges().find((item) => item.key === key) ?? getPresetRanges()[3]
  );
}

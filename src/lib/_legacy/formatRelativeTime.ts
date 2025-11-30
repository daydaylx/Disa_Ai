const relativeFormatter = new Intl.RelativeTimeFormat("de-DE", {
  numeric: "auto",
});

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
});

const toTimestamp = (value: number | string | Date): number => {
  if (typeof value === "number") {
    return value;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return Date.parse(value);
};

export function formatRelativeTime(value: number | string | Date): string {
  const timestamp = toTimestamp(value);
  if (!Number.isFinite(timestamp)) {
    return "";
  }

  const diffMs = timestamp - Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (Math.abs(diffMs) < hour) {
    const minutes = Math.round(diffMs / minute);
    return relativeFormatter.format(minutes, "minute");
  }

  if (Math.abs(diffMs) < day) {
    const hours = Math.round(diffMs / hour);
    return relativeFormatter.format(hours, "hour");
  }

  if (Math.abs(diffMs) < 7 * day) {
    const days = Math.round(diffMs / day);
    return relativeFormatter.format(days, "day");
  }

  return dateFormatter.format(new Date(timestamp));
}

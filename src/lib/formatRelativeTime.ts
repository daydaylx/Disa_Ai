export function formatRelativeTime(timestamp: number, locale = "de"): string {
  const target = Number.isFinite(timestamp) ? timestamp : Date.now();
  const diffSeconds = (target - Date.now()) / 1000;

  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    let value = diffSeconds;
    let unit: Intl.RelativeTimeFormatUnit = "second";

    for (const division of divisions) {
      if (Math.abs(value) < division.amount) {
        unit = division.unit;
        break;
      }
      value /= division.amount;
    }

    return rtf.format(Math.round(value), unit);
  } catch {
    return new Date(target).toLocaleString(locale === "de" ? "de-DE" : locale, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

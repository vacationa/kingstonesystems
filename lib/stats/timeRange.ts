export function buildLocalDayBoundaries(timeRange: "7d" | "30d" | "90d") {
  const daysAgo = timeRange === "30d" ? 29 : timeRange === "90d" ? 89 : 6;

  const now = new Date();
  const todayLocalMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const days = [];
  for (let i = daysAgo; i >= 0; i--) {
    const d = new Date(
      todayLocalMidnight.getFullYear(),
      todayLocalMidnight.getMonth(),
      todayLocalMidnight.getDate() - i,
    );
    const startLocalDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const endLocalDay = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

    // Формуємо локальну дату вручну, щоб уникнути зсувів через UTC
    const yyyy = startLocalDay.getFullYear();
    const mm = String(startLocalDay.getMonth() + 1).padStart(2, "0");
    const dd = String(startLocalDay.getDate()).padStart(2, "0");

    days.push({
      // ЛОКАЛЬНИЙ день, без зсувів
      date: `${yyyy}-${mm}-${dd}`,
      label:
        timeRange === "7d"
          ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][startLocalDay.getDay()]
          : startLocalDay.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      startUTC: startLocalDay.toISOString(),
      endUTC: endLocalDay.toISOString(),
    });
  }

  const rangeStartUTC = days[0].startUTC;
  const rangeEndUTC = days[days.length - 1].endUTC;

  return { days, rangeStartUTC, rangeEndUTC };
}

export function computeStats(rows: Array<{ campaign_id: string; status: string }>) {
  const map: Record<
    string,
    { sent: number; accepted: number; invited: number; cancelled: number }
  > = {};
  for (const r of rows) {
    map[r.campaign_id] ||= { sent: 0, accepted: 0, invited: 0, cancelled: 0 };

    // "sent" = реально відправлено
    if (
      ["invited", "connected", "followup_message_send", "second_followup_message_send"].includes(
        r.status,
      )
    ) {
      map[r.campaign_id].sent++;
    }
    if (["connected", "followup_message_send", "second_followup_message_send"].includes(r.status)) {
      map[r.campaign_id].accepted++;
    }
    if (r.status === "invited") map[r.campaign_id].invited++;
    if (r.status === "cancelled") map[r.campaign_id].cancelled++;
  }
  return map;
}

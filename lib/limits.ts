export class LimitsService {
  async clearWeeklyInviteBlock(linkedinAccountId: string): Promise<void> {
    // No-op on frontend: backend owns the real Redis-based block.
    // Keep as stub to satisfy imports and avoid build errors.
    // Optionally, add logging:
    // console.log(`[limits] clearWeeklyInviteBlock(${linkedinAccountId}) - noop`);
  }
}

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(private capacity: number, private refillPerSec: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  tryTake(cost = 1): boolean {
    this.refill();
    if (this.tokens >= cost) {
      this.tokens -= cost;
      return true;
    }
    return false;
  }

  timeToNextMs(): number {
    this.refill();
    if (this.tokens > 0) return 0;
    const deficit = 1 - this.tokens;
    const sec = deficit / this.refillPerSec;
    return Math.ceil(sec * 1000);
  }

  private refill() {
    const now = Date.now();
    const deltaSec = (now - this.lastRefill) / 1000;
    if (deltaSec <= 0) return;
    this.tokens = Math.min(this.capacity, this.tokens + deltaSec * this.refillPerSec);
    this.lastRefill = now;
  }
}

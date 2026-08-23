/**
 * WebSocket client for the OrbitalDock event bus (orbital-bridge).
 * Keeps live metrics about received events with automatic reconnection
 * and exponential backoff, so screens can show connection status and
 * pull-to-refresh can force a fresh connection.
 */

export type BusStatus = 'connecting' | 'connected' | 'disconnected';

export interface BusEventSummary {
  type: string;
  source: string;
  at: string;
}

export interface BusSnapshot {
  status: BusStatus;
  url: string;
  totalEvents: number;
  byType: Record<string, number>;
  recent: BusEventSummary[];
  lastEventAt: string | null;
  reconnects: number;
}

const MAX_RECENT = 20;
const BASE_BACKOFF_MS = 600;
const MAX_BACKOFF_MS = 15000;

function isValidEvent(value: unknown): value is { type: string; source?: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}

export class OrbitalBusClient {
  private readonly url: string;
  private readonly listeners = new Set<(snapshot: BusSnapshot) => void>();
  private socket: WebSocket | null = null;
  private status: BusStatus = 'disconnected';
  private totalEvents = 0;
  private byType: Record<string, number> = {};
  private recent: BusEventSummary[] = [];
  private lastEventAt: string | null = null;
  private reconnects = 0;
  private attempts = 0;
  private closedByUser = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  getSnapshot(): BusSnapshot {
    return {
      status: this.status,
      url: this.url,
      totalEvents: this.totalEvents,
      byType: { ...this.byType },
      recent: [...this.recent],
      lastEventAt: this.lastEventAt,
      reconnects: this.reconnects,
    };
  }

  subscribe(listener: (snapshot: BusSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  start(): void {
    if (typeof WebSocket === 'undefined') {
      return;
    }
    this.closedByUser = false;
    if (this.socket || this.reconnectTimer) return;
    this.connect();
  }

  stop(): void {
    this.closedByUser = true;
    this.clearReconnectTimer();
    this.socket?.close();
    this.socket = null;
    this.setStatus('disconnected');
  }

  /** Forces an immediate fresh connection (pull-to-refresh / manual retry). */
  refresh(): void {
    this.clearReconnectTimer();
    this.attempts = 0;
    this.socket?.close();
    this.socket = null;
    if (!this.closedByUser) {
      this.connect();
    }
  }

  private connect(): void {
    this.setStatus('connecting');
    try {
      this.socket = new WebSocket(this.url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.attempts = 0;
      this.setStatus('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed: unknown = JSON.parse(String(event.data));
        if (!isValidEvent(parsed)) return;

        const type = parsed.type as string;
        const source = typeof parsed.source === 'string' ? parsed.source : 'unknown';
        const at = new Date().toISOString();

        this.totalEvents += 1;
        this.byType[type] = (this.byType[type] ?? 0) + 1;
        this.lastEventAt = at;
        this.recent = [{ type, source, at }, ...this.recent].slice(0, MAX_RECENT);
        this.emit();
      } catch {
        // Non-JSON frames are ignored: the bus only broadcasts JSON envelopes.
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      if (!this.closedByUser) {
        this.scheduleReconnect();
      } else {
        this.setStatus('disconnected');
      }
    };

    this.socket.onerror = () => {
      // onclose fires right after onerror; reconnection is handled there.
    };
  }

  private scheduleReconnect(): void {
    this.setStatus('disconnected');
    this.clearReconnectTimer();

    const delay = Math.min(BASE_BACKOFF_MS * 2 ** this.attempts, MAX_BACKOFF_MS);
    this.attempts += 1;
    this.reconnects += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.closedByUser) this.connect();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setStatus(status: BusStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.emit();
  }

  private emit(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

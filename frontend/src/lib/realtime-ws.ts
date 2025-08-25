// Real-time WebSocket client for Insurance Claims Dashboard
// Handles real-time updates for claims, fraud alerts, and dashboard statistics

// Import types from the API module for consistency
export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: string;
  server: string;
}

export interface ClaimUpdateMessage extends WebSocketMessage {
  type: 'claim_updated';
  payload: unknown; // Claim data
}

export interface FraudAlertMessage extends WebSocketMessage {
  type: 'fraud_alert_created' | 'fraud_alert_dismissed';
  payload: unknown; // Alert data
}

export interface DashboardStatsMessage extends WebSocketMessage {
  type: 'dashboard_stats';
  payload: unknown; // Statistics data
}

export interface ConnectionMessage extends WebSocketMessage {
  type: 'connection_established';
  payload: {
    client_id: string;
    message: string;
    timestamp: string;
  };
}

// Event callback types
export type EventCallback = (message: WebSocketMessage) => void;
export type ClaimUpdateCallback = (claimData: unknown) => void;
export type FraudAlertCallback = (alertData: unknown) => void;
export type DashboardStatsCallback = (statsData: unknown) => void;
export type ConnectionCallback = (connected: boolean, clientId?: string) => void;

class RealTimeWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnected = false;
  private clientId: string | null = null;

  // Event listeners
  private eventListeners: Map<string, EventCallback[]> = new Map();
  private claimUpdateListeners: ClaimUpdateCallback[] = [];
  private fraudAlertListeners: FraudAlertCallback[] = [];
  private dashboardStatsListeners: DashboardStatsCallback[] = [];
  private connectionListeners: ConnectionCallback[] = [];

  constructor(private url: string = 'ws://localhost:8082/ws') {
    console.log('🔌 RealTimeWebSocketClient initialized with URL:', url);
  }

  // Connect to WebSocket server
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket already connected');
      return;
    }

    try {
      console.log('🔌 Connecting to WebSocket server...');
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

    } catch (error) {
      console.error('🚨 WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    console.log('👋 Disconnecting WebSocket...');
    this.isConnected = false;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Send ping to keep connection alive
  ping(): void {
    if (this.isConnected && this.ws) {
      console.log('🏓 Sending ping to server');
      this.ws.send('ping');
    }
  }

  // Handle WebSocket connection opened
  private handleOpen(): void {
    console.log('✅ WebSocket connected successfully');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Notify connection listeners
    this.notifyConnectionListeners(true);
  }

  // Handle incoming WebSocket messages
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('📨 WebSocket message received:', message.type, message);

      // Handle different message types
      switch (message.type) {
        case 'connection_established':
          this.handleConnectionEstablished(message as ConnectionMessage);
          break;
        
        case 'claim_updated':
          this.handleClaimUpdate(message as ClaimUpdateMessage);
          break;
        
        case 'fraud_alert_created':
        case 'fraud_alert_dismissed':
          this.handleFraudAlert(message as FraudAlertMessage);
          break;
        
        case 'dashboard_stats':
          this.handleDashboardStats(message as DashboardStatsMessage);
          break;
        
        default:
          console.log('📝 Unknown message type:', message.type);
          this.notifyEventListeners(message.type, message);
          break;
      }

    } catch (error) {
      console.error('🚨 Error parsing WebSocket message:', error);
    }
  }

  // Handle WebSocket connection closed
  private handleClose(event: CloseEvent): void {
    console.log('👋 WebSocket connection closed:', event.code, event.reason);
    this.isConnected = false;
    this.ws = null;

    // Notify connection listeners
    this.notifyConnectionListeners(false);

    // Attempt to reconnect if not manually closed
    if (event.code !== 1000) { // 1000 = normal closure
      this.scheduleReconnect();
    }
  }

  // Handle WebSocket errors
  private handleError(event: Event): void {
    console.error('🚨 WebSocket error:', event);
    this.isConnected = false;
  }

  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('🚨 Max reconnection attempts reached. Giving up.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      console.log('🔄 Attempting to reconnect...');
      this.connect();
    }, delay);
  }

  // Handle connection established message
  private handleConnectionEstablished(message: ConnectionMessage): void {
    this.clientId = message.payload.client_id;
    console.log('🎉 Connection established with client ID:', this.clientId);
    
    // Notify connection listeners with client ID
    this.notifyConnectionListeners(true, this.clientId);
  }

  // Handle claim update messages
  private handleClaimUpdate(message: ClaimUpdateMessage): void {
    console.log('📋 Claim updated:', message.payload);
    this.claimUpdateListeners.forEach(callback => {
      try {
        callback(message.payload);
      } catch (error) {
        console.error('🚨 Error in claim update callback:', error);
      }
    });
  }

  // Handle fraud alert messages
  private handleFraudAlert(message: FraudAlertMessage): void {
    console.log('🚨 Fraud alert event:', message.type, message.payload);
    this.fraudAlertListeners.forEach(callback => {
      try {
        callback(message.payload);
      } catch (error) {
        console.error('🚨 Error in fraud alert callback:', error);
      }
    });
  }

  // Handle dashboard statistics messages
  private handleDashboardStats(message: DashboardStatsMessage): void {
    console.log('📊 Dashboard stats updated:', message.payload);
    this.dashboardStatsListeners.forEach(callback => {
      try {
        callback(message.payload);
      } catch (error) {
        console.error('🚨 Error in dashboard stats callback:', error);
      }
    });
  }

  // Notify generic event listeners
  private notifyEventListeners(eventType: string, message: WebSocketMessage): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error(`🚨 Error in event listener for ${eventType}:`, error);
      }
    });
  }

  // Notify connection listeners
  private notifyConnectionListeners(connected: boolean, clientId?: string): void {
    this.connectionListeners.forEach(callback => {
      try {
        callback(connected, clientId);
      } catch (error) {
        console.error('🚨 Error in connection callback:', error);
      }
    });
  }

  // ===========================================================================
  // PUBLIC API FOR SUBSCRIBING TO EVENTS
  // ===========================================================================

  // Subscribe to claim updates
  onClaimUpdate(callback: ClaimUpdateCallback): () => void {
    this.claimUpdateListeners.push(callback);
    return () => {
      const index = this.claimUpdateListeners.indexOf(callback);
      if (index > -1) {
        this.claimUpdateListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to fraud alerts
  onFraudAlert(callback: FraudAlertCallback): () => void {
    this.fraudAlertListeners.push(callback);
    return () => {
      const index = this.fraudAlertListeners.indexOf(callback);
      if (index > -1) {
        this.fraudAlertListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to dashboard statistics updates
  onDashboardStats(callback: DashboardStatsCallback): () => void {
    this.dashboardStatsListeners.push(callback);
    return () => {
      const index = this.dashboardStatsListeners.indexOf(callback);
      if (index > -1) {
        this.dashboardStatsListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to connection status changes
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionListeners.push(callback);
    return () => {
      const index = this.connectionListeners.indexOf(callback);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to custom events
  addEventListener(eventType: string, callback: EventCallback): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
    
    return () => {
      const listeners = this.eventListeners.get(eventType) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // ===========================================================================
  // GETTERS
  // ===========================================================================

  get connected(): boolean {
    return this.isConnected;
  }

  get clientId_(): string | null {
    return this.clientId;
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

// Export singleton instance
export const realTimeClient = new RealTimeWebSocketClient();

// Auto-connect when module is imported (optional)
// realTimeClient.connect();

export default RealTimeWebSocketClient;

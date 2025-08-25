// React hook for WebSocket real-time updates
// Provides easy integration with React components for real-time dashboard updates

import { useEffect, useState, useCallback, useRef } from 'react';
import { realTimeClient, type ClaimUpdateCallback, type FraudAlertCallback, type DashboardStatsCallback } from '../lib/realtime-ws';

// Hook for WebSocket connection status
export function useWebSocketConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // Subscribe to connection changes
    const unsubscribe = realTimeClient.onConnectionChange((connected, id) => {
      setIsConnected(connected);
      setClientId(id || null);
      
      if (connected) {
        setReconnectAttempts(0);
      } else {
        setReconnectAttempts(prev => prev + 1);
      }
    });

    // Connect if not already connected
    if (!realTimeClient.connected) {
      realTimeClient.connect();
    } else {
      setIsConnected(true);
      setClientId(realTimeClient.clientId_);
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const connect = useCallback(() => {
    realTimeClient.connect();
  }, []);

  const disconnect = useCallback(() => {
    realTimeClient.disconnect();
  }, []);

  return {
    isConnected,
    clientId,
    reconnectAttempts,
    connect,
    disconnect
  };
}

// Hook for claim updates
export function useClaimUpdates() {
  const [lastClaimUpdate, setLastClaimUpdate] = useState<unknown | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const callbackRef = useRef<ClaimUpdateCallback | undefined>(undefined);

  // Allow custom callback to be provided
  const onClaimUpdate = useCallback((callback: ClaimUpdateCallback) => {
    callbackRef.current = callback;
  }, []);

  useEffect(() => {
    const handleClaimUpdate: ClaimUpdateCallback = (claimData) => {
      console.log('🔄 Claim update received in hook:', claimData);
      setLastClaimUpdate(claimData);
      setUpdateCount(prev => prev + 1);
      
      // Call custom callback if provided
      if (callbackRef.current) {
        callbackRef.current(claimData);
      }
    };

    const unsubscribe = realTimeClient.onClaimUpdate(handleClaimUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    lastClaimUpdate,
    updateCount,
    onClaimUpdate
  };
}

// Hook for fraud alerts
export function useFraudAlerts() {
  const [lastFraudAlert, setLastFraudAlert] = useState<unknown | null>(null);
  const [alertCount, setAlertCount] = useState(0);
  const callbackRef = useRef<FraudAlertCallback | undefined>(undefined);

  // Allow custom callback to be provided
  const onFraudAlert = useCallback((callback: FraudAlertCallback) => {
    callbackRef.current = callback;
  }, []);

  useEffect(() => {
    const handleFraudAlert: FraudAlertCallback = (alertData) => {
      console.log('🚨 Fraud alert received in hook:', alertData);
      setLastFraudAlert(alertData);
      setAlertCount(prev => prev + 1);
      
      // Call custom callback if provided
      if (callbackRef.current) {
        callbackRef.current(alertData);
      }
    };

    const unsubscribe = realTimeClient.onFraudAlert(handleFraudAlert);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    lastFraudAlert,
    alertCount,
    onFraudAlert
  };
}

// Hook for dashboard statistics
export function useDashboardStats() {
  const [lastStatsUpdate, setLastStatsUpdate] = useState<unknown | null>(null);
  const [statsUpdateCount, setStatsUpdateCount] = useState(0);
  const callbackRef = useRef<DashboardStatsCallback | undefined>(undefined);

  // Allow custom callback to be provided
  const onStatsUpdate = useCallback((callback: DashboardStatsCallback) => {
    callbackRef.current = callback;
  }, []);

  useEffect(() => {
    const handleStatsUpdate: DashboardStatsCallback = (statsData) => {
      console.log('📊 Stats update received in hook:', statsData);
      setLastStatsUpdate(statsData);
      setStatsUpdateCount(prev => prev + 1);
      
      // Call custom callback if provided
      if (callbackRef.current) {
        callbackRef.current(statsData);
      }
    };

    const unsubscribe = realTimeClient.onDashboardStats(handleStatsUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    lastStatsUpdate,
    statsUpdateCount,
    onStatsUpdate
  };
}

// Comprehensive hook that provides all real-time functionality
export function useRealTimeUpdates() {
  const connection = useWebSocketConnection();
  const claimUpdates = useClaimUpdates();
  const fraudAlerts = useFraudAlerts();
  const dashboardStats = useDashboardStats();

  return {
    connection,
    claimUpdates,
    fraudAlerts,
    dashboardStats
  };
}

// Hook for real-time notifications (can be used for toast notifications)
export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'claim' | 'fraud' | 'stats';
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    const claimUnsubscribe = realTimeClient.onClaimUpdate(() => {
      setNotifications(prev => [...prev, {
        id: `claim-${Date.now()}`,
        type: 'claim',
        message: 'Claim status has been updated',
        timestamp: new Date()
      }]);
    });

    const fraudUnsubscribe = realTimeClient.onFraudAlert(() => {
      setNotifications(prev => [...prev, {
        id: `fraud-${Date.now()}`,
        type: 'fraud',
        message: 'New fraud alert received',
        timestamp: new Date()
      }]);
    });

    const statsUnsubscribe = realTimeClient.onDashboardStats(() => {
      setNotifications(prev => [...prev, {
        id: `stats-${Date.now()}`,
        type: 'stats',
        message: 'Dashboard statistics updated',
        timestamp: new Date()
      }]);
    });

    return () => {
      claimUnsubscribe();
      fraudUnsubscribe();
      statsUnsubscribe();
    };
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    clearNotification,
    clearAllNotifications
  };
}

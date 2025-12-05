import React, { createContext, useContext, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface TuyaContextType {
  apiKey: string;
  controlDevice: (deviceId: string, status: boolean) => Promise<boolean>;
  getDeviceStatus: (deviceId: string) => Promise<boolean | null>;
}

const TuyaContext = createContext<TuyaContextType | undefined>(undefined);

// Tuya API configuration
const TUYA_API_KEY = 'tuya-api-key-xxx';
const TUYA_API_BASE = 'https://openapi.tuyaus.com'; // US datacenter - adjust as needed

export function TuyaProvider({ children }: { children: React.ReactNode }) {
  const controlDevice = useCallback(async (deviceId: string, status: boolean): Promise<boolean> => {
    try {
      // In production, this would make actual Tuya API calls
      // POST /v1.0/devices/{device_id}/commands
      console.log(`[Tuya API] Controlling device ${deviceId}: ${status ? 'ON' : 'OFF'}`);
      console.log(`[Tuya API] Using API Key: ${TUYA_API_KEY}`);
      console.log(`[Tuya API] Endpoint: ${TUYA_API_BASE}/v1.0/devices/${deviceId}/commands`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      
      if (!success) {
        throw new Error('Device communication failed');
      }
      
      return true;
    } catch (error) {
      console.error('[Tuya API] Error:', error);
      toast({
        title: 'Device Control Failed',
        description: 'Unable to communicate with the device. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  const getDeviceStatus = useCallback(async (deviceId: string): Promise<boolean | null> => {
    try {
      // In production: GET /v1.0/devices/{device_id}/status
      console.log(`[Tuya API] Getting status for device ${deviceId}`);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return random status for demo
      return Math.random() > 0.5;
    } catch (error) {
      console.error('[Tuya API] Error getting status:', error);
      return null;
    }
  }, []);

  return (
    <TuyaContext.Provider
      value={{
        apiKey: TUYA_API_KEY,
        controlDevice,
        getDeviceStatus,
      }}
    >
      {children}
    </TuyaContext.Provider>
  );
}

export function useTuya() {
  const context = useContext(TuyaContext);
  if (context === undefined) {
    throw new Error('useTuya must be used within a TuyaProvider');
  }
  return context;
}

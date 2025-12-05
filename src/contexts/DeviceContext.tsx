import React, { createContext, useContext, useState, useCallback } from 'react';
import { Device, DeviceType } from '@/types/device';
import { useTuya } from './TuyaContext';
import { toast } from '@/hooks/use-toast';

interface DeviceContextType {
  devices: Device[];
  isLoading: boolean;
  addDevice: (device: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeDevice: (id: string) => void;
  toggleDevice: (id: string) => Promise<void>;
  getDevicesByType: (type: DeviceType) => Device[];
  getDeviceStats: () => { total: number; online: number; offline: number };
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Dummy data - structured for MySQL integration
const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'Lobby Chandelier', type: 'light', status: true, roomNumber: 'LOBBY', tuyaDeviceId: 'tuya_001', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Room 101 Light', type: 'light', status: false, roomNumber: '101', tuyaDeviceId: 'tuya_002', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Room 102 Light', type: 'light', status: true, roomNumber: '102', tuyaDeviceId: 'tuya_003', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Lobby Ceiling Fan', type: 'fan', status: true, roomNumber: 'LOBBY', tuyaDeviceId: 'tuya_004', createdAt: new Date(), updatedAt: new Date() },
  { id: '5', name: 'Room 101 Fan', type: 'fan', status: false, roomNumber: '101', tuyaDeviceId: 'tuya_005', createdAt: new Date(), updatedAt: new Date() },
  { id: '6', name: 'Room 101 AC', type: 'ac', status: true, roomNumber: '101', tuyaDeviceId: 'tuya_006', createdAt: new Date(), updatedAt: new Date() },
  { id: '7', name: 'Room 102 AC', type: 'ac', status: true, roomNumber: '102', tuyaDeviceId: 'tuya_007', createdAt: new Date(), updatedAt: new Date() },
  { id: '8', name: 'Lobby TV', type: 'tv', status: false, roomNumber: 'LOBBY', tuyaDeviceId: 'tuya_008', createdAt: new Date(), updatedAt: new Date() },
  { id: '9', name: 'Room 101 TV', type: 'tv', status: true, roomNumber: '101', tuyaDeviceId: 'tuya_009', createdAt: new Date(), updatedAt: new Date() },
  { id: '10', name: 'Main MCB', type: 'mcb', status: true, roomNumber: 'ELEC', tuyaDeviceId: 'tuya_010', createdAt: new Date(), updatedAt: new Date() },
  { id: '11', name: 'Floor 1 MCB', type: 'mcb', status: true, roomNumber: 'ELEC', tuyaDeviceId: 'tuya_011', createdAt: new Date(), updatedAt: new Date() },
  { id: '12', name: 'Room 101 Lock', type: 'lock', status: true, roomNumber: '101', tuyaDeviceId: 'tuya_012', createdAt: new Date(), updatedAt: new Date() },
  { id: '13', name: 'Room 102 Lock', type: 'lock', status: false, roomNumber: '102', tuyaDeviceId: 'tuya_013', createdAt: new Date(), updatedAt: new Date() },
  { id: '14', name: 'Main Entrance Lock', type: 'lock', status: true, roomNumber: 'MAIN', tuyaDeviceId: 'tuya_014', createdAt: new Date(), updatedAt: new Date() },
];

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [isLoading, setIsLoading] = useState(false);
  const { controlDevice } = useTuya();

  const addDevice = useCallback((device: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDevice: Device = {
      ...device,
      id: `device_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDevices(prev => [...prev, newDevice]);
    toast({
      title: 'Device Added',
      description: `${device.name} has been added successfully.`,
    });
  }, []);

  const removeDevice = useCallback((id: string) => {
    setDevices(prev => {
      const device = prev.find(d => d.id === id);
      if (device) {
        toast({
          title: 'Device Removed',
          description: `${device.name} has been removed.`,
        });
      }
      return prev.filter(d => d.id !== id);
    });
  }, []);

  const toggleDevice = useCallback(async (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    setIsLoading(true);
    const newStatus = !device.status;
    
    const success = await controlDevice(device.tuyaDeviceId, newStatus);
    
    if (success) {
      setDevices(prev =>
        prev.map(d =>
          d.id === id
            ? { ...d, status: newStatus, updatedAt: new Date() }
            : d
        )
      );
      toast({
        title: `${device.name}`,
        description: `Turned ${newStatus ? 'ON' : 'OFF'}`,
      });
    }
    
    setIsLoading(false);
  }, [devices, controlDevice]);

  const getDevicesByType = useCallback((type: DeviceType) => {
    return devices.filter(d => d.type === type);
  }, [devices]);

  const getDeviceStats = useCallback(() => {
    const total = devices.length;
    const online = devices.filter(d => d.status).length;
    return { total, online, offline: total - online };
  }, [devices]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        isLoading,
        addDevice,
        removeDevice,
        toggleDevice,
        getDevicesByType,
        getDeviceStats,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}

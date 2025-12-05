export type DeviceType = 'light' | 'fan' | 'ac' | 'tv' | 'mcb' | 'lock';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: boolean;
  roomNumber: string;
  tuyaDeviceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceTypeInfo {
  type: DeviceType;
  label: string;
  icon: string;
  description: string;
}

export const DEVICE_TYPES: DeviceTypeInfo[] = [
  { type: 'light', label: 'Lights', icon: 'Lightbulb', description: 'Room lighting control' },
  { type: 'fan', label: 'Fans', icon: 'Fan', description: 'Ceiling and exhaust fans' },
  { type: 'ac', label: 'AC', icon: 'AirVent', description: 'Air conditioning units' },
  { type: 'tv', label: 'TV', icon: 'Tv', description: 'Television sets' },
  { type: 'mcb', label: 'MCB', icon: 'Zap', description: 'Main circuit breakers' },
  { type: 'lock', label: 'Lock', icon: 'Lock', description: 'Smart door locks' },
];

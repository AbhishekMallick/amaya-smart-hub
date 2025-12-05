import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevices } from '@/contexts/DeviceContext';
import { DeviceType, DEVICE_TYPES } from '@/types/device';
import { DeviceCard } from './DeviceCard';
import { AddDeviceDialog } from './AddDeviceDialog';
import { StatsCard } from './StatsCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Hotel,
  LogOut,
  LayoutGrid,
  Power,
  PowerOff,
  Lightbulb,
  Fan,
  AirVent,
  Tv,
  Zap,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  light: Lightbulb,
  fan: Fan,
  ac: AirVent,
  tv: Tv,
  mcb: Zap,
  lock: Lock,
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const { devices, getDevicesByType, getDeviceStats } = useDevices();
  const [activeTab, setActiveTab] = useState<string>('all');
  const stats = getDeviceStats();

  const filteredDevices =
    activeTab === 'all' ? devices : getDevicesByType(activeTab as DeviceType);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shadow-lg">
                <Hotel className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  Amaya Hotels
                </h1>
                <p className="text-xs text-muted-foreground">Device Control Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Total Devices"
            value={stats.total}
            icon={LayoutGrid}
            variant="default"
          />
          <StatsCard
            title="Online"
            value={stats.online}
            icon={Power}
            variant="success"
          />
          <StatsCard
            title="Offline"
            value={stats.offline}
            icon={PowerOff}
            variant="warning"
          />
        </div>

        {/* Tabs & Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-secondary h-auto flex-wrap">
              <TabsTrigger value="all" className="gap-1.5">
                <LayoutGrid className="w-4 h-4" />
                All
              </TabsTrigger>
              {DEVICE_TYPES.map((dt) => {
                const Icon = iconMap[dt.type];
                return (
                  <TabsTrigger key={dt.type} value={dt.type} className="gap-1.5">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{dt.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <AddDeviceDialog />
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.map((device, index) => (
            <div
              key={device.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DeviceCard device={device} />
            </div>
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No Devices Found
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'all'
                ? 'Add your first device to get started.'
                : `No ${DEVICE_TYPES.find((t) => t.type === activeTab)?.label.toLowerCase()} devices found.`}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by Tuya Smart Technology • © 2024 Amaya Hotels
          </p>
        </div>
      </footer>
    </div>
  );
}

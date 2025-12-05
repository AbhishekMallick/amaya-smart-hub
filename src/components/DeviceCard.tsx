import { Device, DEVICE_TYPES } from '@/types/device';
import { useDevices } from '@/contexts/DeviceContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Lightbulb, Fan, AirVent, Tv, Zap, Lock, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  light: Lightbulb,
  fan: Fan,
  ac: AirVent,
  tv: Tv,
  mcb: Zap,
  lock: Lock,
};

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { toggleDevice, removeDevice, isLoading } = useDevices();
  const Icon = iconMap[device.type];
  const typeInfo = DEVICE_TYPES.find(t => t.type === device.type);

  return (
    <div
      className={cn(
        "group relative p-5 rounded-xl border transition-all duration-300",
        device.status
          ? "bg-card border-primary/30 shadow-lg shadow-primary/10"
          : "bg-card/50 border-border hover:border-border/80"
      )}
    >
      {/* Status Indicator */}
      <div
        className={cn(
          "absolute top-4 right-4 w-2.5 h-2.5 rounded-full transition-all duration-300",
          device.status ? "bg-success animate-pulse-glow" : "bg-muted-foreground/50"
        )}
      />

      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300",
          device.status
            ? "gradient-gold shadow-lg"
            : "bg-secondary"
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6 transition-colors duration-300",
            device.status ? "text-primary-foreground" : "text-muted-foreground"
          )}
        />
      </div>

      {/* Device Info */}
      <h3 className="font-semibold text-foreground mb-1 pr-6">
        {device.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-1">
        Room: {device.roomNumber}
      </p>
      <p className="text-xs text-muted-foreground/70 mb-4">
        {typeInfo?.label}
      </p>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={device.status}
            onCheckedChange={() => toggleDevice(device.id)}
            disabled={isLoading}
          />
          <span className={cn(
            "text-sm font-medium",
            device.status ? "text-success" : "text-muted-foreground"
          )}>
            {device.status ? 'ON' : 'OFF'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => removeDevice(device.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 rounded-xl flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

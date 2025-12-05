import { useState } from 'react';
import { useDevices } from '@/contexts/DeviceContext';
import { DeviceType, DEVICE_TYPES } from '@/types/device';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Lightbulb, Fan, AirVent, Tv, Zap, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const iconMap = {
  light: Lightbulb,
  fan: Fan,
  ac: AirVent,
  tv: Tv,
  mcb: Zap,
  lock: Lock,
};

export function AddDeviceDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('light');
  const [roomNumber, setRoomNumber] = useState('');
  const [tuyaDeviceId, setTuyaDeviceId] = useState('');
  const { addDevice } = useDevices();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !roomNumber || !tuyaDeviceId) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    addDevice({
      name,
      type,
      status: false,
      roomNumber: roomNumber.toUpperCase(),
      tuyaDeviceId,
    });

    // Reset form
    setName('');
    setType('light');
    setRoomNumber('');
    setTuyaDeviceId('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              placeholder="e.g., Room 201 Light"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Device Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as DeviceType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map((dt) => {
                  const Icon = iconMap[dt.type];
                  return (
                    <SelectItem key={dt.type} value={dt.type}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {dt.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room Number</Label>
            <Input
              id="room"
              placeholder="e.g., 201, LOBBY, MAIN"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tuya">Tuya Device ID</Label>
            <Input
              id="tuya"
              placeholder="e.g., tuya_xxxxx"
              value={tuyaDeviceId}
              onChange={(e) => setTuyaDeviceId(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gold" className="flex-1">
              Add Device
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

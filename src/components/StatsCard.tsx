import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning';
}

export function StatsCard({ title, value, icon: Icon, variant = 'default' }: StatsCardProps) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            variant === 'success' && "bg-success/20",
            variant === 'warning' && "bg-destructive/20",
            variant === 'default' && "bg-primary/20"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              variant === 'success' && "text-success",
              variant === 'warning' && "text-destructive",
              variant === 'default' && "text-primary"
            )}
          />
        </div>
      </div>
    </div>
  );
}

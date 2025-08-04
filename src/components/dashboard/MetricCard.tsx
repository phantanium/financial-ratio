import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  benchmark?: string;
  description?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  benchmark,
  description 
}: MetricCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const getTrendIcon = () => {
    if (isPositive) return TrendingUp;
    if (isNegative) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
        
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          {
            "bg-accent-light text-success": isPositive,
            "bg-destructive/10 text-destructive": isNegative,
            "bg-muted text-muted-foreground": isNeutral
          }
        )}>
          <TrendIcon className="w-3 h-3" />
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          {changeLabel}
        </div>
        
        {benchmark && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Industry Avg:</span>
            <span className="font-medium text-foreground">{benchmark}</span>
          </div>
        )}
        
        {description && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
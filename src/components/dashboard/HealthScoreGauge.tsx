import { cn } from "@/lib/utils";

interface HealthScoreGaugeProps {
  score: number; // 0-100
  title?: string;
}

export default function HealthScoreGauge({ score, title = "Financial Health Score" }: HealthScoreGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
        
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={score >= 80 ? "hsl(var(--success))" : score >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn("text-4xl font-bold", getScoreColor(score))}>
              {score}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {getScoreLabel(score)}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Liquidity</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success transition-all duration-500"
                  style={{ width: "85%" }}
                />
              </div>
              <span className="text-foreground font-medium">85</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Profitability</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warning transition-all duration-500"
                  style={{ width: "72%" }}
                />
              </div>
              <span className="text-foreground font-medium">72</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Leverage</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success transition-all duration-500"
                  style={{ width: "78%" }}
                />
              </div>
              <span className="text-foreground font-medium">78</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Activity</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warning transition-all duration-500"
                  style={{ width: "68%" }}
                />
              </div>
              <span className="text-foreground font-medium">68</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            Based on industry benchmarks and peer comparison
          </p>
        </div>
      </div>
    </div>
  );
}
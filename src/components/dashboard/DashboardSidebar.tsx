import { BarChart3, TrendingUp, Shield, Activity, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const ratioCategories = [
  {
    id: "liquidity",
    name: "Liquidity Ratios",
    icon: BarChart3,
    description: "Short-term financial health",
    metrics: ["Current Ratio", "Quick Ratio", "Cash Ratio"]
  },
  {
    id: "profitability", 
    name: "Profitability Ratios",
    icon: TrendingUp,
    description: "Earning capability analysis",
    metrics: ["ROE", "ROA", "Net Margin", "Gross Margin"]
  },
  {
    id: "leverage",
    name: "Leverage Ratios", 
    icon: Shield,
    description: "Debt and solvency analysis",
    metrics: ["Debt-to-Equity", "Debt Ratio", "Interest Coverage"]
  },
  {
    id: "activity",
    name: "Activity Ratios",
    icon: Activity, 
    description: "Asset utilization efficiency",
    metrics: ["Asset Turnover", "Inventory Turnover", "Receivables Turnover"]
  },
];

interface DashboardSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isCollapsed: boolean;
}

export default function DashboardSidebar({ 
  activeCategory, 
  onCategoryChange, 
  isCollapsed 
}: DashboardSidebarProps) {
  return (
    <aside className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-primary" />
          {!isCollapsed && (
            <span className="font-medium text-foreground">Financial Ratios</span>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {ratioCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                  "hover:bg-secondary/80 hover:shadow-sm",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", {
                  "text-primary-foreground": isActive,
                  "text-primary": !isActive
                })} />
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-medium text-sm", {
                      "text-primary-foreground": isActive,
                      "text-foreground": !isActive
                    })}>
                      {category.name}
                    </div>
                    <div className={cn("text-xs mt-0.5", {
                      "text-primary-foreground/80": isActive,
                      "text-muted-foreground": !isActive
                    })}>
                      {category.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Quick Access</p>
            <p>Use keyboard shortcuts:</p>
            <p>1-4 for ratio categories</p>
          </div>
        </div>
      )}
    </aside>
  );
}
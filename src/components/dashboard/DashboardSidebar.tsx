// src/components/dashboard/DashboardSidebar.tsx
import { BarChart3, TrendingUp, Shield, Activity, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isCollapsed: boolean;
  availableCategories?: string[];
}

const categoryConfig = {
  liquidity: {
    icon: BarChart3,
    label: "Liquidity",
    description: "Short-term financial health"
  },
  profitability: {
    icon: TrendingUp,
    label: "Profitability", 
    description: "Revenue and profit metrics"
  },
  leverage: {
    icon: Shield,
    label: "Leverage",
    description: "Debt and equity ratios"
  },
  activity: {
    icon: Activity,
    label: "Activity",
    description: "Asset utilization efficiency"
  }
};

export default function DashboardSidebar({ 
  activeCategory, 
  onCategoryChange, 
  isCollapsed,
  availableCategories = []
}: DashboardSidebarProps) {
  // Filter categories based on what's available in the data
  const categoriesToShow = availableCategories.length > 0 
    ? availableCategories.filter(cat => categoryConfig[cat as keyof typeof categoryConfig])
    : Object.keys(categoryConfig);

  return (
    <aside className={cn(
      "bg-card border-r border-border transition-all duration-300 flex-shrink-0",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <nav className="p-4 space-y-2">
        <div className={cn(
          "text-sm font-medium text-muted-foreground mb-4",
          isCollapsed && "text-center"
        )}>
          {isCollapsed ? "📊" : "Financial Ratios"}
        </div>
        
        {categoriesToShow.map((category) => {
          const config = categoryConfig[category as keyof typeof categoryConfig];
          if (!config) return null;
          
          const Icon = config.icon;
          const isActive = activeCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary text-primary-foreground shadow-sm",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{config.label}</div>
                  <div className={cn(
                    "text-xs opacity-75",
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {config.description}
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {/* Empty state */}
        {categoriesToShow.length === 0 && !isCollapsed && (
          <div className="text-center text-muted-foreground text-sm py-4">
            <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No ratio categories available
          </div>
        )}
      </nav>
    </aside>
  );
}
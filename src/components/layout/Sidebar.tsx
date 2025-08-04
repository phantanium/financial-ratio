import { NavLink } from "react-router-dom";
import { 
  Home, 
  Droplet, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Users, 
  Settings,
  FileBarChart 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Liquidity Ratios", href: "/liquidity", icon: Droplet },
  { name: "Profitability Ratios", href: "/profitability", icon: TrendingUp },
  { name: "Leverage Ratios", href: "/leverage", icon: BarChart3 },
  { name: "Activity Ratios", href: "/activity", icon: Activity },
  { name: "Company Comparison", href: "/comparison", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileBarChart className="w-6 h-6 text-primary" />
          <span className="font-semibold text-foreground">IndonesiaFinance</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                    "hover:bg-secondary/80 hover:shadow-sm",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("w-5 h-5 flex-shrink-0", {
                      "text-primary-foreground": isActive,
                      "text-primary": !isActive
                    })} />
                    <span className={cn("font-medium text-sm", {
                      "text-primary-foreground": isActive,
                      "text-foreground": !isActive
                    })}>
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
import { useState } from "react";
import { Menu } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MetricCard from "@/components/dashboard/MetricCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import HealthScoreGauge from "@/components/dashboard/HealthScoreGauge";
import { Button } from "@/components/ui/button";

const mockMetrics = {
  liquidity: [
    {
      title: "Current Ratio",
      value: "2.34",
      change: 8.2,
      changeLabel: "vs previous quarter",
      benchmark: "1.85",
      description: "Current assets divided by current liabilities"
    },
    {
      title: "Quick Ratio", 
      value: "1.67",
      change: 5.1,
      changeLabel: "vs previous quarter",
      benchmark: "1.42",
      description: "Quick assets divided by current liabilities"
    },
    {
      title: "Cash Ratio",
      value: "0.89",
      change: 12.3,
      changeLabel: "vs previous quarter", 
      benchmark: "0.65",
      description: "Cash and equivalents divided by current liabilities"
    },
    {
      title: "Working Capital",
      value: "₹12.4B",
      change: 6.8,
      changeLabel: "vs previous quarter",
      benchmark: "₹9.8B",
      description: "Current assets minus current liabilities"
    }
  ],
  profitability: [
    {
      title: "Return on Equity",
      value: "18.5%",
      change: 2.1,
      changeLabel: "vs previous quarter",
      benchmark: "15.2%",
      description: "Net income divided by shareholders' equity"
    },
    {
      title: "Return on Assets",
      value: "12.3%", 
      change: 1.8,
      changeLabel: "vs previous quarter",
      benchmark: "9.7%",
      description: "Net income divided by total assets"
    },
    {
      title: "Net Profit Margin",
      value: "24.7%",
      change: 3.2,
      changeLabel: "vs previous quarter",
      benchmark: "18.9%",
      description: "Net profit divided by total revenue"
    },
    {
      title: "Gross Margin",
      value: "45.2%",
      change: 1.5,
      changeLabel: "vs previous quarter",
      benchmark: "38.1%",
      description: "Gross profit divided by total revenue"
    }
  ]
};

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState("bbca");
  const [activeCategory, setActiveCategory] = useState("liquidity");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentMetrics = mockMetrics[activeCategory as keyof typeof mockMetrics] || mockMetrics.liquidity;

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <DashboardHeader 
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />
      
      <div className="flex">
        <DashboardSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground capitalize">
                  {activeCategory} Analysis
                </h2>
                <p className="text-muted-foreground">
                  Financial performance metrics and trend analysis
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="md:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialChart title="Ratio Trend Analysis" />
              <HealthScoreGauge score={76} />
            </div>

            {/* Additional Insights */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Key Insights & Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Strong Liquidity Position</p>
                      <p className="text-xs text-muted-foreground">
                        Current ratio above industry average indicates healthy short-term financial position
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Monitor Debt Levels</p>
                      <p className="text-xs text-muted-foreground">
                        Leverage ratios are approaching industry thresholds
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Consistent Profitability</p>
                      <p className="text-xs text-muted-foreground">
                        ROE trending upward over the last 6 quarters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Operational Efficiency</p>
                      <p className="text-xs text-muted-foreground">
                        Asset turnover ratios outperforming sector peers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
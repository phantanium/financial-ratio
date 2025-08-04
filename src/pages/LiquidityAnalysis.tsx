import { useState } from "react";
import { Droplet } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import HealthScoreGauge from "@/components/dashboard/HealthScoreGauge";

const liquidityMetrics = [
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
];

export default function LiquidityAnalysis() {
  const [selectedCompany, setSelectedCompany] = useState("bbca");

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <DashboardHeader 
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Droplet className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Liquidity Analysis</h1>
              <p className="text-muted-foreground">Short-term financial health and cash flow metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liquidityMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialChart title="Liquidity Ratios Trend" />
            <HealthScoreGauge score={82} />
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Liquidity Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Strong Current Position</p>
                    <p className="text-xs text-muted-foreground">Current ratio well above industry benchmark</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Adequate Cash Reserves</p>
                    <p className="text-xs text-muted-foreground">Cash ratio indicates good immediate liquidity</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Working Capital Growth</p>
                    <p className="text-xs text-muted-foreground">Consistent improvement in working capital management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Monitor Efficiency</p>
                    <p className="text-xs text-muted-foreground">High ratios may indicate excess cash not being utilized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
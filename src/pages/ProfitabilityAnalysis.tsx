import { useState } from "react";
import { TrendingUp } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import HealthScoreGauge from "@/components/dashboard/HealthScoreGauge";

const profitabilityMetrics = [
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
];

export default function ProfitabilityAnalysis() {
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
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profitability Analysis</h1>
              <p className="text-muted-foreground">Earning capability and profit margin metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {profitabilityMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialChart title="Profitability Trends" />
            <HealthScoreGauge score={78} />
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Profitability Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Exceptional ROE Performance</p>
                    <p className="text-xs text-muted-foreground">Return on equity significantly above industry average</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Strong Margin Control</p>
                    <p className="text-xs text-muted-foreground">Both gross and net margins trending upward</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Asset Efficiency</p>
                    <p className="text-xs text-muted-foreground">ROA indicates effective asset utilization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Consistent Growth</p>
                    <p className="text-xs text-muted-foreground">All profitability metrics showing positive trends</p>
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
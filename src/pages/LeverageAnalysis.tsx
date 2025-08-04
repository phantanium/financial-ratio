import { useState } from "react";
import { BarChart3 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import HealthScoreGauge from "@/components/dashboard/HealthScoreGauge";

const leverageMetrics = [
  {
    title: "Debt-to-Equity Ratio",
    value: "0.65",
    change: -2.3,
    changeLabel: "vs previous quarter",
    benchmark: "0.75",
    description: "Total debt divided by shareholders' equity"
  },
  {
    title: "Debt-to-Assets Ratio",
    value: "0.39",
    change: -1.8,
    changeLabel: "vs previous quarter",
    benchmark: "0.45",
    description: "Total debt divided by total assets"
  },
  {
    title: "Times Interest Earned",
    value: "4.2x",
    change: 8.5,
    changeLabel: "vs previous quarter",
    benchmark: "3.5x",
    description: "EBIT divided by interest expense"
  },
  {
    title: "Equity Multiplier",
    value: "2.1x",
    change: -1.2,
    changeLabel: "vs previous quarter",
    benchmark: "2.3x",
    description: "Total assets divided by shareholders' equity"
  }
];

export default function LeverageAnalysis() {
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
            <BarChart3 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Leverage Analysis</h1>
              <p className="text-muted-foreground">Debt management and financial leverage metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leverageMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialChart title="Leverage Ratios Trend" />
            <HealthScoreGauge score={72} />
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Leverage Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Improved Debt Position</p>
                    <p className="text-xs text-muted-foreground">Debt ratios decreasing, showing deleveraging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Strong Interest Coverage</p>
                    <p className="text-xs text-muted-foreground">Times interest earned above industry benchmark</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Conservative Leverage</p>
                    <p className="text-xs text-muted-foreground">Debt levels well within acceptable ranges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Monitor Growth Funding</p>
                    <p className="text-xs text-muted-foreground">Low leverage may limit growth opportunities</p>
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
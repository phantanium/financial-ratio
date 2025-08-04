import { useState } from "react";
import { Activity } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import HealthScoreGauge from "@/components/dashboard/HealthScoreGauge";

const activityMetrics = [
  {
    title: "Asset Turnover",
    value: "1.15x",
    change: 3.2,
    changeLabel: "vs previous quarter",
    benchmark: "0.95x",
    description: "Revenue divided by average total assets"
  },
  {
    title: "Inventory Turnover",
    value: "8.5x",
    change: 5.8,
    changeLabel: "vs previous quarter",
    benchmark: "7.2x",
    description: "Cost of goods sold divided by average inventory"
  },
  {
    title: "Receivables Turnover",
    value: "12.3x",
    change: 2.1,
    changeLabel: "vs previous quarter",
    benchmark: "10.8x",
    description: "Revenue divided by average accounts receivable"
  },
  {
    title: "Days Sales Outstanding",
    value: "29.7 days",
    change: -4.2,
    changeLabel: "vs previous quarter",
    benchmark: "33.8 days",
    description: "Average collection period for receivables"
  }
];

export default function ActivityAnalysis() {
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
            <Activity className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Analysis</h1>
              <p className="text-muted-foreground">Asset utilization and operational efficiency metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activityMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialChart title="Activity Ratios Trend" />
            <HealthScoreGauge score={85} />
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Activity Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Excellent Asset Utilization</p>
                    <p className="text-xs text-muted-foreground">Asset turnover ratio exceeding industry standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Efficient Inventory Management</p>
                    <p className="text-xs text-muted-foreground">High inventory turnover indicates good demand forecasting</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Fast Collection Cycle</p>
                    <p className="text-xs text-muted-foreground">Low DSO demonstrates effective credit management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Operational Excellence</p>
                    <p className="text-xs text-muted-foreground">All activity metrics trending positively</p>
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
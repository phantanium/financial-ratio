import { useState } from "react";
import { Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const companies = [
  { id: "bbca", name: "Bank Central Asia Tbk", ticker: "BBCA.JK" },
  { id: "bbri", name: "Bank Rakyat Indonesia Tbk", ticker: "BBRI.JK" },
  { id: "bmri", name: "Bank Mandiri Tbk", ticker: "BMRI.JK" },
  { id: "tlkm", name: "Telkom Indonesia Tbk", ticker: "TLKM.JK" },
  { id: "unvr", name: "Unilever Indonesia Tbk", ticker: "UNVR.JK" },
];

const comparisonData = [
  { metric: "Current Ratio", bbca: "2.34", bbri: "1.89", bmri: "2.12", tlkm: "1.56", unvr: "0.95" },
  { metric: "ROE (%)", bbca: "18.5", bbri: "16.2", bmri: "15.8", tlkm: "12.3", unvr: "22.1" },
  { metric: "ROA (%)", bbca: "12.3", bbri: "10.8", bmri: "11.2", tlkm: "8.5", unvr: "18.7" },
  { metric: "Debt-to-Equity", bbca: "0.65", bbri: "0.72", bmri: "0.68", tlkm: "0.45", unvr: "0.38" },
  { metric: "Asset Turnover", bbca: "1.15", bbri: "1.08", bmri: "1.12", tlkm: "0.89", unvr: "1.45" },
];

export default function CompanyComparison() {
  const [selectedCompany, setSelectedCompany] = useState("bbca");
  const [compareCompany, setCompareCompany] = useState("bbri");

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <DashboardHeader 
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Company Comparison</h1>
              <p className="text-muted-foreground">Side-by-side financial performance analysis</p>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-muted-foreground">Compare with:</span>
              <Select value={compareCompany} onValueChange={setCompareCompany}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companies.filter(c => c.id !== selectedCompany).map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.ticker} - {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium text-foreground">Financial Metric</th>
                    <th className="text-center p-3 font-medium text-primary">
                      {companies.find(c => c.id === selectedCompany)?.ticker}
                    </th>
                    <th className="text-center p-3 font-medium text-accent">
                      {companies.find(c => c.id === compareCompany)?.ticker}
                    </th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => {
                    const value1 = parseFloat(row[selectedCompany as keyof typeof row] as string);
                    const value2 = parseFloat(row[compareCompany as keyof typeof row] as string);
                    const difference = ((value1 - value2) / value2 * 100).toFixed(1);
                    const isPositive = value1 > value2;
                    
                    return (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="p-3 font-medium text-foreground">{row.metric}</td>
                        <td className="p-3 text-center text-primary font-semibold">
                          {row[selectedCompany as keyof typeof row]}
                        </td>
                        <td className="p-3 text-center text-accent font-semibold">
                          {row[compareCompany as keyof typeof row]}
                        </td>
                        <td className={`p-3 text-center font-medium ${
                          isPositive ? 'text-success' : 'text-destructive'
                        }`}>
                          {isPositive ? '+' : ''}{difference}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {companies.find(c => c.id === selectedCompany)?.name} Strengths
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Superior Liquidity</p>
                    <p className="text-xs text-muted-foreground">Higher current ratio provides better short-term security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Strong Profitability</p>
                    <p className="text-xs text-muted-foreground">ROE and ROA metrics outperform comparison</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {companies.find(c => c.id === compareCompany)?.name} Strengths
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Market Position</p>
                    <p className="text-xs text-muted-foreground">Strong competitive positioning in sector</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Growth Potential</p>
                    <p className="text-xs text-muted-foreground">Strategic initiatives showing positive momentum</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
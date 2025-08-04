import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ChartData {
  period: string;
  currentRatio: number;
  quickRatio: number;
  industryAvg: number;
}

const mockData: ChartData[] = [
  { period: "Q1 2023", currentRatio: 1.8, quickRatio: 1.2, industryAvg: 1.5 },
  { period: "Q2 2023", currentRatio: 1.9, quickRatio: 1.3, industryAvg: 1.5 },
  { period: "Q3 2023", currentRatio: 2.1, quickRatio: 1.4, industryAvg: 1.6 },
  { period: "Q4 2023", currentRatio: 2.0, quickRatio: 1.3, industryAvg: 1.6 },
  { period: "Q1 2024", currentRatio: 2.2, quickRatio: 1.5, industryAvg: 1.7 },
  { period: "Q2 2024", currentRatio: 2.3, quickRatio: 1.6, industryAvg: 1.7 },
];

interface FinancialChartProps {
  title: string;
  data?: ChartData[];
}

export default function FinancialChart({ title, data = mockData }: FinancialChartProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Trend analysis over the last 6 quarters
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="period" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px"
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="currentRatio" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              name="Current Ratio"
            />
            <Line 
              type="monotone" 
              dataKey="quickRatio" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
              name="Quick Ratio"
            />
            <Line 
              type="monotone" 
              dataKey="industryAvg" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 2, r: 3 }}
              name="Industry Average"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ChartData {
  period: string;
  [key: string]: string | number;
}

interface FinancialChartProps {
  title: string;
  data?: Record<string, Array<{ period: string; value: number }>>;
  category?: string;
}

const mockData: ChartData[] = [
  { period: "Q1 2023", currentRatio: 1.8, quickRatio: 1.2, industryAvg: 1.5 },
  { period: "Q2 2023", currentRatio: 1.9, quickRatio: 1.3, industryAvg: 1.5 },
  { period: "Q3 2023", currentRatio: 2.1, quickRatio: 1.4, industryAvg: 1.6 },
  { period: "Q4 2023", currentRatio: 2.0, quickRatio: 1.3, industryAvg: 1.6 },
  { period: "Q1 2024", currentRatio: 2.2, quickRatio: 1.5, industryAvg: 1.7 },
  { period: "Q2 2024", currentRatio: 2.3, quickRatio: 1.6, industryAvg: 1.7 },
];

export default function FinancialChart({ 
  title, 
  data, 
  category 
}: FinancialChartProps) {
  
  // Transform API trend data to chart format
  const transformTrendData = (trendsData: Record<string, Array<{ period: string; value: number }>>, categoryFilter?: string): ChartData[] => {
    if (!trendsData || Object.keys(trendsData).length === 0) {
      return mockData;
    }

    // Filter trends by category if provided
    const relevantTrends = categoryFilter 
      ? Object.entries(trendsData).filter(([key]) => key.startsWith(categoryFilter))
      : Object.entries(trendsData);

    if (relevantTrends.length === 0) {
      return mockData;
    }

    // Get all unique periods from all trend lines
    const allPeriods = new Set<string>();
    relevantTrends.forEach(([_, trendData]) => {
      trendData.forEach(point => allPeriods.add(point.period));
    });

    const sortedPeriods = Array.from(allPeriods).sort();

    // Transform to chart data format
    const chartData: ChartData[] = sortedPeriods.map(period => {
      const dataPoint: ChartData = { period };
      
      relevantTrends.forEach(([trendKey, trendData]) => {
        const dataForPeriod = trendData.find(point => point.period === period);
        if (dataForPeriod) {
          // Clean up the key name for display
          const cleanKey = trendKey
            .replace(categoryFilter + '_', '')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
          dataPoint[cleanKey] = dataForPeriod.value;
        }
      });

      return dataPoint;
    });

    return chartData.slice(-6); // Show last 6 periods
  };

  const chartData = transformTrendData(data || {}, category);
  
  // Get dynamic data keys (excluding 'period')
  const dataKeys = Object.keys(chartData[0] || {}).filter(key => key !== 'period');
  
  // Color palette for different lines
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))", 
    "hsl(var(--accent))",
    "hsl(220, 70%, 50%)",
    "hsl(280, 70%, 50%)",
    "hsl(340, 70%, 50%)"
  ];

  // Generate clean metric names
  const getCleanMetricName = (key: string): string => {
    const nameMap: Record<string, string> = {
      'currentRatio': 'Current Ratio',
      'quickRatio': 'Quick Ratio', 
      'cashRatio': 'Cash Ratio',
      'roe': 'ROE (%)',
      'roa': 'ROA (%)',
      'npm': 'Net Profit Margin (%)',
      'nim': 'Net Interest Margin (%)',
      'gpm': 'Gross Profit Margin (%)',
      'der': 'Debt to Equity',
      'dar': 'Debt to Assets',
      'assetTurnover': 'Asset Turnover',
      'loanToDepositRatio': 'Loan to Deposit Ratio',
      'equityMultiplier': 'Equity Multiplier'
    };
    
    return nameMap[key] || key;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {data && Object.keys(data).length > 0 
            ? `Historical trend analysis - ${dataKeys.length} metrics tracked`
            : "Trend analysis over the last 6 quarters (sample data)"
          }
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              formatter={(value: any, name: string) => [
                typeof value === 'number' ? value.toFixed(2) : value,
                getCleanMetricName(name)
              ]}
            />
            <Legend 
              formatter={(value: string) => getCleanMetricName(value)}
            />
            
            {/* Render lines dynamically based on available data */}
            {dataKeys.slice(0, 4).map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ 
                  fill: colors[index % colors.length], 
                  strokeWidth: 2, 
                  r: 4 
                }}
                name={key}
                connectNulls={false}
              />
            ))}
            
            {/* Industry average line (mock data for now) */}
            {dataKeys.length > 0 && (
              <Line 
                type="monotone" 
                dataKey="industryAvg" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 2, r: 3 }}
                name="Industry Average"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for data availability */}
      {data && Object.keys(data).length > 0 && (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Showing {dataKeys.length} metrics from real financial data. 
            {dataKeys.length > 4 && ` (Displaying top 4 for clarity)`}
          </p>
        </div>
      )}
    </div>
  );
} 
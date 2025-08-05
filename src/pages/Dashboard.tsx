import { useState, useEffect } from "react";
import { Menu, Home, RefreshCw, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MetricCard from "@/components/dashboard/MetricCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import HealthScoreGauge from "@/components/dashboard/HealthScoreGauge";
import CopyrightFooter from "@/components/common/CopyrightFooter";
import { Button } from "@/components/ui/button";
import { apiService, type Company, type CompanyRatios } from "@/lib/apiService";

interface MetricData {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  benchmark: string;
  description: string;
}

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState("BBCA.JK");
  const [activeCategory, setActiveCategory] = useState("liquidity");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // API State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyData, setCompanyData] = useState<CompanyRatios | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Load company data when selection changes
  useEffect(() => {
    if (selectedCompany) {
      loadCompanyData(selectedCompany);
    }
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      const response = await apiService.getCompanies();
      if (response.success) {
        setCompanies(response.data);
        setLastUpdated(response.last_updated || null);
      } else {
        setError('Failed to load companies');
      }
    } catch (err) {
      setError(`Error loading companies: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const loadCompanyData = async (ticker: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCompanyRatios(ticker);
      if (response.success) {
        setCompanyData(response.data);
      } else {
        setError(`Failed to load data for ${ticker}`);
      }
    } catch (err) {
      setError(`Error loading company data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      await apiService.refreshData();
      await loadCompanies();
      if (selectedCompany) {
        await loadCompanyData(selectedCompany);
      }
    } catch (err) {
      setError(`Error refreshing data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatRatiosToMetrics = (ratios: CompanyRatios['ratios'], category: string): MetricData[] => {
    if (!ratios || !ratios[category as keyof typeof ratios]) return [];

    const categoryData = ratios[category as keyof typeof ratios];
    if (!categoryData) return [];

    const metrics: MetricData[] = [];

    Object.entries(categoryData).forEach(([key, value]) => {
      const formattedValue = typeof value === 'number' ? 
        (key.includes('Ratio') || key.includes('ratio') ? value.toFixed(2) : `${value.toFixed(2)}%`) : 
        String(value);

      metrics.push({
        title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: formattedValue,
        change: Math.random() * 10 - 5, // Mock change for now
        changeLabel: "vs previous period",
        benchmark: (typeof value === 'number' ? (value * 0.85).toFixed(2) : "N/A"),
        description: getMetricDescription(key)
      });
    });

    return metrics;
  };

  const getMetricDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      currentRatio: "Current assets divided by current liabilities",
      quickRatio: "Quick assets divided by current liabilities", 
      cashRatio: "Cash and equivalents divided by current liabilities",
      loanToDepositRatio: "Net loans divided by total deposits",
      roe: "Net income divided by shareholders' equity",
      roa: "Net income divided by total assets",
      npm: "Net profit divided by total revenue",
      nim: "Net interest margin for banking operations",
      gpm: "Gross profit divided by total revenue",
      der: "Total debt divided by shareholders' equity",
      dar: "Total debt divided by total assets",
      equityMultiplier: "Total assets divided by shareholders' equity",
      debtToAssets: "Total liabilities divided by total assets",
      assetTurnover: "Revenue divided by total assets"
    };
    return descriptions[key] || "Financial performance metric";
  };

  const calculateHealthScore = (ratios: CompanyRatios['ratios']): number => {
    if (!ratios) return 0;
    
    let score = 50; // Base score
    
    // Profitability boost
    if (ratios.profitability?.roe && ratios.profitability.roe > 15) score += 20;
    if (ratios.profitability?.roa && ratios.profitability.roa > 5) score += 15;
    
    // Liquidity considerations
    if (ratios.liquidity?.currentRatio && ratios.liquidity.currentRatio > 1.2) score += 10;
    if (ratios.liquidity?.loanToDepositRatio && ratios.liquidity.loanToDepositRatio < 0.9) score += 10;
    
    // Leverage penalty
    if (ratios.leverage?.der && ratios.leverage.der > 2) score -= 15;
    
    return Math.min(Math.max(score, 0), 100);
  };

  if (loading && !companyData) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error && !companyData) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Connection Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currentMetrics = companyData ? formatRatiosToMetrics(companyData.ratios, activeCategory) : [];
  const healthScore = companyData ? calculateHealthScore(companyData.ratios) : 0;

  return (
    <div className="min-h-screen bg-dashboard-bg flex flex-col">
      <DashboardHeader 
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        companies={companies}
        companyData={companyData}
      />
      
      <div className="flex flex-1">
        <DashboardSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isCollapsed={sidebarCollapsed}
          availableCategories={companyData?.ratios ? Object.keys(companyData.ratios) : []}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with toggle and refresh */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
                  <p className="text-muted-foreground">
                    {companyData ? `${companyData.name} (${companyData.sector}) - ${companyData.latest_period}` : 
                     'Comprehensive financial performance overview'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date(lastUpdated).toLocaleString()}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="md:hidden"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentMetrics.length > 0 ? (
                currentMetrics.slice(0, 4).map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No {activeCategory} ratios available for this company
                </div>
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialChart 
                title={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Trend Analysis`}
                data={companyData?.trends || {}}
                category={activeCategory}
              />
              <HealthScoreGauge score={healthScore} />
            </div>

            {/* Company Insights */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Key Insights & Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {companyData?.sector === 'Banking' && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Banking Performance</p>
                          <p className="text-xs text-muted-foreground">
                            ROE of {companyData.ratios.profitability?.roe}% shows {companyData.ratios.profitability?.roe && companyData.ratios.profitability.roe > 15 ? 'strong' : 'moderate'} profitability
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Asset Quality</p>
                          <p className="text-xs text-muted-foreground">
                            Banking ratios indicate {healthScore > 70 ? 'healthy' : 'moderate'} asset management
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {companyData?.sector !== 'Banking' && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Liquidity Position</p>
                          <p className="text-xs text-muted-foreground">
                            Current ratio of {companyData?.ratios.liquidity?.currentRatio} indicates {companyData?.ratios.liquidity?.currentRatio && companyData.ratios.liquidity.currentRatio > 1 ? 'healthy' : 'tight'} liquidity
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Leverage Analysis</p>
                          <p className="text-xs text-muted-foreground">
                            Debt ratios are within {companyData?.ratios.leverage?.der && companyData.ratios.leverage.der < 2 ? 'acceptable' : 'elevated'} range
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Overall Health Score</p>
                      <p className="text-xs text-muted-foreground">
                        Financial health score of {healthScore}/100 based on key ratios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Sector Comparison</p>
                      <p className="text-xs text-muted-foreground">
                        Performance relative to {companyData?.sector} sector standards
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <CopyrightFooter />
    </div>
  );
}
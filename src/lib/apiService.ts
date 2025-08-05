// src/lib/apiService.ts
const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  last_updated?: string;
  error?: string;
}

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface CompanyRatios {
  ticker: string;
  name: string;
  sector: string;
  latest_period: string;
  ratios: {
    liquidity?: Record<string, number>;
    profitability?: Record<string, number>;
    leverage?: Record<string, number>;
    activity?: Record<string, number>;
  };
  trends: Record<string, Array<{ period: string; value: number }>>;
}

class ApiService {
  private baseURL = API_BASE_URL;

  private async fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  private async postData<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API post error:', error);
      throw error;
    }
  }

  async getCompanies(): Promise<ApiResponse<Company[]>> {
    return this.fetchData<Company[]>('/companies');
  }

  async getCompanyRatios(ticker: string): Promise<ApiResponse<CompanyRatios>> {
    return this.fetchData<CompanyRatios>(`/ratios/${ticker}`);
  }

  async compareCompanies(tickers: string[]): Promise<ApiResponse<any>> {
    return this.postData('/compare', { tickers });
  }

  async getSectors(): Promise<ApiResponse<any>> {
    return this.fetchData('/sectors');
  }

  async refreshData(): Promise<ApiResponse<any>> {
    return this.postData('/refresh', {});
  }

  async getHealth(): Promise<ApiResponse<any>> {
    return this.fetchData('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
export type { Company, CompanyRatios, ApiResponse };
import requests
import pandas as pd
import json
from datetime import datetime, timedelta
import time
import logging
from typing import Dict, List, Optional
import yfinance as yf

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BEIDataScraper:
    def __init__(self):
        """
        Initializes the scraper with a requests session and a predefined list of IDX companies.
        """
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # A more comprehensive list of Indonesian public companies
        self.companies = {
            "BBCA.JK": {"name": "Bank Central Asia Tbk", "sector": "Banking"},
            "BMRI.JK": {"name": "Bank Mandiri Tbk", "sector": "Banking"},
            "BBRI.JK": {"name": "Bank Rakyat Indonesia Tbk", "sector": "Banking"},
            "BBNI.JK": {"name": "Bank Negara Indonesia Tbk", "sector": "Banking"},
            "TLKM.JK": {"name": "Telkom Indonesia Tbk", "sector": "Telecommunications"},
            "UNVR.JK": {"name": "Unilever Indonesia Tbk", "sector": "Consumer Goods"},
            "ASII.JK": {"name": "Astra International Tbk", "sector": "Conglomerate"},
            "INDF.JK": {"name": "Indofood Sukses Makmur Tbk", "sector": "Food & Beverages"},
            "KLBF.JK": {"name": "Kalbe Farma Tbk", "sector": "Pharmaceuticals"},
            "ICBP.JK": {"name": "Indofood CBP Sukses Makmur Tbk", "sector": "Food & Beverages"},
            "GGRM.JK": {"name": "Gudang Garam Tbk", "sector": "Tobacco"},
            "ADRO.JK": {"name": "Adaro Energy Tbk", "sector": "Mining"},
            "ANTM.JK": {"name": "Aneka Tambang Tbk", "sector": "Mining"},
            "INCO.JK": {"name": "Vale Indonesia Tbk", "sector": "Mining"},
            "SMGR.JK": {"name": "Semen Indonesia Tbk", "sector": "Cement"}
        }

    def _get_financial_data_yfinance(self, ticker: str) -> Optional[Dict]:
        """
        Fetches financial data (annual and quarterly) using the yfinance library.
        """
        try:
            logger.info(f"Fetching financial data for {ticker} from yfinance...")
            stock = yf.Ticker(ticker)
            
            # Fetch all available data points
            financial_data = {
                'info': stock.info,
                'financials': stock.financials,
                'balance_sheet': stock.balance_sheet,
                'cashflow': stock.cashflow,
                'quarterly_financials': stock.quarterly_financials,
                'quarterly_balance_sheet': stock.quarterly_balance_sheet
            }
            logger.info(f"Successfully fetched data for {ticker}.")
            return financial_data
            
        except Exception as e:
            logger.error(f"Error fetching data for {ticker} from yfinance: {e}")
            return None

    def _find_financial_item(self, df: pd.DataFrame, possible_keys: List[str], period) -> float:
        """
        Finds a financial item in a DataFrame by checking a list of possible keys.
        This handles inconsistencies in naming from the data source.
        """
        for key in possible_keys:
            if key in df.index:
                value = df.loc[key, period]
                return float(value) if pd.notna(value) else 0.0
        return 0.0

    def _calculate_ratios(self, financial_data: Dict, ticker: str) -> Dict:
        """
        Calculates financial ratios from annual financial statements.
        It intelligently handles differences between banking and non-banking companies.
        """
        try:
            balance_sheet = financial_data.get('balance_sheet')
            financials = financial_data.get('financials')
            
            if balance_sheet is None or financials is None or balance_sheet.empty or financials.empty:
                logger.warning(f"Annual financial data is missing or empty for {ticker}. Skipping ratio calculation.")
                return {}

            company_info = self.companies.get(ticker, {})
            is_bank = company_info.get("sector") == "Banking"
            
            ratios_by_period = {}
            
            # Use the most recent 4 periods available
            periods = balance_sheet.columns[:4]
            
            for period in periods:
                period_str = str(period.year)
                
                # --- Data Extraction ---
                # Use a helper function to find items with various possible names
                bs_lower_index = {str(idx).lower(): idx for idx in balance_sheet.index}
                is_lower_index = {str(idx).lower(): idx for idx in financials.index}

                # Helper to extract value
                def get_bs_val(keys):
                    for k in keys:
                        if k in bs_lower_index:
                            return float(balance_sheet.loc[bs_lower_index[k], period]) or 0
                    return 0
                
                def get_is_val(keys):
                    for k in keys:
                        if k in is_lower_index:
                            return float(financials.loc[is_lower_index[k], period]) or 0
                    return 0

                # --- Common Items ---
                total_assets = get_bs_val(['total assets', 'total asset'])
                total_equity = get_bs_val(['stockholders equity', 'common stock equity', 'total equity gross minority interest'])
                net_income = get_is_val(['net income from continuing operation net minority interest', 'net income'])
                revenue = get_is_val(['total revenue', 'revenue'])
                total_liabilities = get_bs_val(['total liabilities net minority interest', 'total liabilities'])
                if total_liabilities == 0 and total_assets > 0 and total_equity > 0:
                     total_liabilities = total_assets - total_equity


                ratios = {}
                if is_bank:
                    # --- Banking Specific Ratios ---
                    deposits = get_bs_val(['total deposits', 'customer deposits'])
                    net_loans = get_bs_val(['net loans', 'loans'])
                    net_interest_income = get_is_val(['net interest income'])
                    
                    # For banks, "Current Ratio" isn't standard. We can use other liquidity metrics.
                    # Here, we'll calculate Loan-to-Deposit Ratio (LDR) as an activity/liquidity measure.
                    ratios = {
                        'liquidity': {
                            'loanToDepositRatio': round(net_loans / deposits, 2) if deposits != 0 else 0,
                        },
                        'profitability': {
                            'roe': round((net_income / total_equity) * 100, 2) if total_equity != 0 else 0,
                            'roa': round((net_income / total_assets) * 100, 2) if total_assets != 0 else 0,
                            'nim': round((net_interest_income / total_assets) * 100, 2) if total_assets != 0 else 0, # Net Interest Margin
                        },
                        'leverage': {
                            'equityMultiplier': round(total_assets / total_equity, 2) if total_equity != 0 else 0,
                            'debtToAssets': round(total_liabilities / total_assets, 2) if total_assets != 0 else 0,
                        },
                        'activity': {} # LDR is already in liquidity
                    }
                else:
                    # --- Non-Banking Ratios ---
                    current_assets = get_bs_val(['current assets', 'total current assets'])
                    current_liabilities = get_bs_val(['current liabilities', 'total current liabilities'])
                    inventory = get_bs_val(['inventory'])
                    cash = get_bs_val(['cash and cash equivalents', 'cash'])
                    gross_profit = get_is_val(['gross profit'])
                    
                    ratios = {
                        'liquidity': {
                            'currentRatio': round(current_assets / current_liabilities, 2) if current_liabilities != 0 else 0,
                            'quickRatio': round((current_assets - inventory) / current_liabilities, 2) if current_liabilities != 0 else 0,
                            'cashRatio': round(cash / current_liabilities, 2) if current_liabilities != 0 else 0
                        },
                        'profitability': {
                            'roe': round((net_income / total_equity) * 100, 2) if total_equity != 0 else 0,
                            'roa': round((net_income / total_assets) * 100, 2) if total_assets != 0 else 0,
                            'npm': round((net_income / revenue) * 100, 2) if revenue != 0 else 0,
                            'gpm': round((gross_profit / revenue) * 100, 2) if revenue != 0 else 0
                        },
                        'leverage': {
                            'der': round(total_liabilities / total_equity, 2) if total_equity != 0 else 0,
                            'dar': round(total_liabilities / total_assets, 2) if total_assets != 0 else 0,
                        },
                        'activity': {
                            'assetTurnover': round(revenue / total_assets, 2) if total_assets != 0 else 0,
                        }
                    }
                
                ratios_by_period[period_str] = ratios
            
            return ratios_by_period
            
        except Exception as e:
            logger.error(f"Error calculating ratios for {ticker}: {e}", exc_info=True)
            return {}

    def get_company_data(self, ticker: str) -> Dict:
        """
        Orchestrates the process of fetching data, calculating ratios, and formatting the final output.
        """
        logger.info(f"--- Processing {ticker} ---")
        
        financial_data = self._get_financial_data_yfinance(ticker)
        if not financial_data:
            return {}
        
        ratios_by_period = self._calculate_ratios(financial_data, ticker)
        
        if not ratios_by_period:
            logger.warning(f"Could not calculate any ratios for {ticker}. Final data will be empty.")
            return {}
            
        company_info = self.companies.get(ticker, {"name": ticker, "sector": "Unknown"})
        
        # Get latest period data
        sorted_periods = sorted(ratios_by_period.keys(), reverse=True)
        latest_period = sorted_periods[0] if sorted_periods else "N/A"
        latest_ratios = ratios_by_period.get(latest_period, {})
        
        # Create trend data for charts (last 4 periods)
        trends = {}
        if latest_ratios:
            for category, ratio_dict in latest_ratios.items():
                for ratio_name in ratio_dict.keys():
                    trend_data = []
                    for period in sorted(ratios_by_period.keys()):
                        value = ratios_by_period.get(period, {}).get(category, {}).get(ratio_name)
                        if value is not None:
                             trend_data.append({'period': period, 'value': value})
                    trends[f"{category}_{ratio_name}"] = trend_data[-4:]
        
        return {
            'ticker': ticker,
            'name': company_info['name'],
            'sector': company_info['sector'],
            'latest_period': latest_period,
            'ratios': latest_ratios,
            'trends': trends,
            'all_periods': ratios_by_period
        }

    def get_all_companies_data(self) -> Dict:
        """
        Gets data for all companies defined in self.companies.
        """
        all_data = {}
        for ticker in self.companies.keys():
            try:
                company_data = self.get_company_data(ticker)
                if company_data:
                    all_data[ticker] = company_data
                    logger.info(f"Successfully processed and formatted data for {ticker}")
                else:
                    logger.warning(f"No data generated for {ticker}")
                
                time.sleep(1) # Be polite to the API server
            except Exception as e:
                logger.error(f"A critical error occurred while processing {ticker}: {e}", exc_info=True)
                continue
        return all_data

    def save_data_to_json(self, data: Dict, filename: str = "bei_financial_data.json"):
        """
        Saves the final data dictionary to a JSON file.
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False, default=str)
            logger.info(f"All data successfully saved to {filename}")
        except Exception as e:
            logger.error(f"Error saving data to JSON file: {e}")

# --- Example Usage ---
if __name__ == "__main__":
    scraper = BEIDataScraper()
    
    # --- Test with a single BANK company ---
    print("\n" + "="*20 + " TESTING WITH A BANK (BBCA.JK) " + "="*20)
    bbca_data = scraper.get_company_data("BBCA.JK")
    if bbca_data:
        print(json.dumps(bbca_data['ratios'], indent=2))
    
    # --- Test with a single NON-BANK company ---
    print("\n" + "="*20 + " TESTING WITH A NON-BANK (UNVR.JK) " + "="*20)
    unvr_data = scraper.get_company_data("UNVR.JK")
    if unvr_data:
        print(json.dumps(unvr_data['ratios'], indent=2))

    # --- Uncomment to run for all companies and save to file ---
    # print("\n" + "="*20 + " PROCESSING ALL COMPANIES " + "="*20)
    # all_companies_data = scraper.get_all_companies_data()
    # scraper.save_data_to_json(all_companies_data)
    # print(f"\nProcessing complete. Processed {len(all_companies_data)} companies.")


from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime
import threading
import time

# Import your scraper class (make sure it's in the same directory)
from paste import BEIDataScraper

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global variables for caching
financial_data_cache = {}
last_update_time = None
UPDATE_INTERVAL = 3600  # Update every hour (3600 seconds)

# Initialize scraper
scraper = BEIDataScraper()

def load_or_create_data():
    """
    Load data from JSON file if exists, otherwise create new data
    """
    global financial_data_cache, last_update_time
    
    json_file = "bei_financial_data.json"
    
    # Try to load existing data
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                financial_data_cache = json.load(f)
            last_update_time = datetime.now()
            print(f"Loaded existing data for {len(financial_data_cache)} companies")
            return True
        except Exception as e:
            print(f"Error loading existing data: {e}")
    
    # Create new data if file doesn't exist
    print("Creating new financial data...")
    financial_data_cache = scraper.get_all_companies_data()
    scraper.save_data_to_json(financial_data_cache, json_file)
    last_update_time = datetime.now()
    print(f"Created new data for {len(financial_data_cache)} companies")
    return True

def update_data_background():
    """
    Background task to periodically update financial data
    """
    global financial_data_cache, last_update_time
    
    while True:
        try:
            time.sleep(UPDATE_INTERVAL)
            print("Updating financial data in background...")
            
            new_data = scraper.get_all_companies_data()
            if new_data:
                financial_data_cache = new_data
                scraper.save_data_to_json(financial_data_cache)
                last_update_time = datetime.now()
                print(f"Background update completed for {len(financial_data_cache)} companies")
            
        except Exception as e:
            print(f"Error in background update: {e}")

@app.route('/api/companies', methods=['GET'])
def get_companies_list():
    """
    Get list of all available companies
    """
    try:
        companies_list = []
        for ticker, data in financial_data_cache.items():
            companies_list.append({
                'ticker': ticker,
                'name': data.get('name', ''),
                'sector': data.get('sector', '')
            })
        
        return jsonify({
            'success': True,
            'data': companies_list,
            'last_updated': last_update_time.isoformat() if last_update_time else None
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/company/<ticker>', methods=['GET'])
def get_company_data(ticker):
    """
    Get detailed financial data for a specific company
    """
    try:
        ticker_upper = ticker.upper()
        if ticker_upper not in financial_data_cache:
            return jsonify({
                'success': False,
                'error': f'Company {ticker} not found'
            }), 404
        
        company_data = financial_data_cache[ticker_upper]
        
        return jsonify({
            'success': True,
            'data': company_data,
            'last_updated': last_update_time.isoformat() if last_update_time else None
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ratios/<ticker>', methods=['GET'])
def get_company_ratios(ticker):
    """
    Get only financial ratios for a specific company
    """
    try:
        ticker_upper = ticker.upper()
        if ticker_upper not in financial_data_cache:
            return jsonify({
                'success': False,
                'error': f'Company {ticker} not found'
            }), 404
        
        company_data = financial_data_cache[ticker_upper]
        
        response_data = {
            'ticker': ticker_upper,
            'name': company_data.get('name', ''),
            'sector': company_data.get('sector', ''),
            'latest_period': company_data.get('latest_period', ''),
            'ratios': company_data.get('ratios', {}),
            'trends': company_data.get('trends', {})
        }
        
        return jsonify({
            'success': True,
            'data': response_data,
            'last_updated': last_update_time.isoformat() if last_update_time else None
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/compare', methods=['POST'])
def compare_companies():
    """
    Compare financial ratios between multiple companies
    """
    try:
        request_data = request.get_json()
        tickers = request_data.get('tickers', [])
        
        if not tickers:
            return jsonify({
                'success': False,
                'error': 'No tickers provided'
            }), 400
        
        comparison_data = {}
        for ticker in tickers:
            ticker_upper = ticker.upper()
            if ticker_upper in financial_data_cache:
                company_data = financial_data_cache[ticker_upper]
                comparison_data[ticker_upper] = {
                    'name': company_data.get('name', ''),
                    'sector': company_data.get('sector', ''),
                    'ratios': company_data.get('ratios', {})
                }
        
        return jsonify({
            'success': True,
            'data': comparison_data,
            'last_updated': last_update_time.isoformat() if last_update_time else None
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sectors', methods=['GET'])
def get_sectors():
    """
    Get companies grouped by sector
    """
    try:
        sectors = {}
        for ticker, data in financial_data_cache.items():
            sector = data.get('sector', 'Unknown')
            if sector not in sectors:
                sectors[sector] = []
            
            sectors[sector].append({
                'ticker': ticker,
                'name': data.get('name', ''),
                'latest_period': data.get('latest_period', ''),
                'key_ratios': {
                    'roe': data.get('ratios', {}).get('profitability', {}).get('roe', 0),
                    'roa': data.get('ratios', {}).get('profitability', {}).get('roa', 0)
                }
            })
        
        return jsonify({
            'success': True,
            'data': sectors,
            'last_updated': last_update_time.isoformat() if last_update_time else None
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    API health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'companies_loaded': len(financial_data_cache),
        'last_updated': last_update_time.isoformat() if last_update_time else None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/refresh', methods=['POST'])
def refresh_data():
    """
    Manually trigger data refresh
    """
    try:
        global financial_data_cache, last_update_time
        
        print("Manual data refresh triggered...")
        financial_data_cache = scraper.get_all_companies_data()
        scraper.save_data_to_json(financial_data_cache)
        last_update_time = datetime.now()
        
        return jsonify({
            'success': True,
            'message': f'Data refreshed successfully for {len(financial_data_cache)} companies',
            'last_updated': last_update_time.isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Financial Dashboard API Server...")
    
    # Load initial data
    if load_or_create_data():
        print(f"Initial data loaded successfully")
    else:
        print("Failed to load initial data")
        exit(1)
    
    # Start background update thread
    update_thread = threading.Thread(target=update_data_background, daemon=True)
    update_thread.start()
    print("Background data update thread started")
    
    # Start Flask server
    print("API Server starting on http://localhost:5000")
    print("\nAvailable endpoints:")
    print("- GET  /api/companies        - List all companies")
    print("- GET  /api/company/{ticker} - Get company details")
    print("- GET  /api/ratios/{ticker}  - Get company ratios")
    print("- POST /api/compare          - Compare companies")
    print("- GET  /api/sectors          - Companies by sector")
    print("- GET  /api/health           - Health check")
    print("- POST /api/refresh          - Manual data refresh")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
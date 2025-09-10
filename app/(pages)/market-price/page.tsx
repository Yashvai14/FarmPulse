'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navBar';
import Papa from 'papaparse';

type PriceData = {
  commodity: string;
  market: string;
  state: string;
  modal_price: string;
  min_price: string;
  max_price: string;
  arrival_date: string;
  district?: string;
  variety?: string;
};

type CommodityTrend = {
  name: string;
  current_price: number;
  previous_price: number;
  change: number;
  change_percent: number;
};

const topSuggestions = ["Tomato", "Potato", "Onion", "Apple", "Banana", "Mango", "Wheat", "Rice", "Cotton", "Sugarcane"];

const mockTrendingCommodities: CommodityTrend[] = [
  { name: "Tomato", current_price: 25, previous_price: 20, change: 5, change_percent: 25 },
  { name: "Onion", current_price: 18, previous_price: 22, change: -4, change_percent: -18.18 },
  { name: "Potato", current_price: 12, previous_price: 10, change: 2, change_percent: 20 },
  { name: "Apple", current_price: 80, previous_price: 75, change: 5, change_percent: 6.67 },
  { name: "Wheat", current_price: 22, previous_price: 21, change: 1, change_percent: 4.76 },
  { name: "Rice", current_price: 35, previous_price: 38, change: -3, change_percent: -7.89 }
];

const MarketSearch = () => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [trendingData, setTrendingData] = useState<CommodityTrend[]>(mockTrendingCommodities);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Multiple data sources for better reliability
  const DATA_SOURCES = [
    {
      name: "Government API",
      url: "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001ca01add76476460875c1f81143aca958&format=json&limit=500",
      type: "json"
    },
    {
      name: "Backup CSV",
      url: "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001ca01add76476460875c1f81143aca958&format=csv&limit=500",
      type: "csv"
    }
  ];
  
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // Fallback mock data for when API is unavailable
  const getMockData = (commodity: string): PriceData[] => {
    const basePrice = Math.floor(Math.random() * 50) + 20;
    const markets = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
    const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana'];
    
    return markets.map((market, index) => ({
      commodity: commodity,
      market: `${market} Mandi`,
      state: states[index],
      modal_price: (basePrice + Math.floor(Math.random() * 20) - 10).toString(),
      min_price: (basePrice - Math.floor(Math.random() * 10)).toString(),
      max_price: (basePrice + Math.floor(Math.random() * 15)).toString(),
      arrival_date: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      district: market,
      variety: 'Premium Grade'
    }));
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setFilteredData([]);

    // Try multiple data sources
    for (let sourceIndex = 0; sourceIndex < DATA_SOURCES.length; sourceIndex++) {
      const source = DATA_SOURCES[sourceIndex];
      
      try {
        console.log(`Trying ${source.name}...`);
        const response = await fetch(source.url);
        
        if (!response.ok) {
          console.log(`${source.name} failed with status ${response.status}`);
          continue;
        }

        let allData: PriceData[] = [];
        
        if (source.type === 'json') {
          const jsonData = await response.json();
          allData = jsonData.records || jsonData.data || jsonData;
        } else {
          const csvText = await response.text();
          const parsed = Papa.parse(csvText, { header: true });
          allData = parsed.data as PriceData[];
        }

        // Enhanced filtering with state and advanced search
        let results = allData.filter((item) => {
          const commodityMatch = (item.commodity?.toLowerCase() || '').includes(searchQuery.toLowerCase());
          const marketMatch = (item.market?.toLowerCase() || '').includes(searchQuery.toLowerCase());
          const stateMatch = !selectedState || (item.state?.toLowerCase() || '').includes(selectedState.toLowerCase());
          
          return (commodityMatch || marketMatch) && stateMatch;
        });

        // Sort by date (most recent first)
        results.sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime());

        if (results.length > 0) {
          // Enhanced deduplication and grouping
          const seen = new Set();
          const uniqueResults: PriceData[] = [];

          for (const item of results) {
            const key = `${item.commodity}-${item.market}-${item.state}`;
            if (!seen.has(key) && item.modal_price && parseFloat(item.modal_price) > 0) {
              seen.add(key);
              uniqueResults.push(item);
            }
            if (uniqueResults.length === 12) break;
          }

          if (uniqueResults.length > 0) {
            setFilteredData(uniqueResults);
            setLoading(false);
            return; // Success! Exit the function
          }
        }
        
        console.log(`${source.name} returned no valid results, trying next source...`);
      } catch (sourceError) {
        console.log(`${source.name} failed:`, sourceError);
        continue; // Try next source
      }
    }
    
    // If all sources failed, use mock data
    console.log('All data sources failed, using mock data...');
    const mockResults = getMockData(searchQuery);
    setFilteredData(mockResults);
    setError(`Real-time data temporarily unavailable. Showing sample prices for "${searchQuery}". Please try again later for live data.`);
    setLoading(false);
  };

  const handleQuickSearch = (commodity: string) => {
    setQuery(commodity);
    handleSearch(commodity);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 lg:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
                <div className="bg-lime-100 p-3 lg:p-4 rounded-2xl">
                  <span className="text-3xl lg:text-4xl">📈</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-lime-600 font-bold mb-4">Market Price Tracker</h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                    Get real-time agricultural commodity prices from mandis across India. Make informed selling decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100 mb-8">
              <div className="max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search commodity or market (e.g., Tomato, Nagpur)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full border-2 border-green-200 rounded-xl px-4 sm:px-6 py-3 sm:py-4 focus:outline-none focus:border-lime-400 transition-colors text-base sm:text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="flex-1 sm:flex-none border-2 border-green-200 rounded-xl px-4 py-3 sm:py-4 focus:outline-none focus:border-lime-400 transition-colors"
                    >
                      <option value="">All States</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSearch()}
                      disabled={loading}
                      className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
                    >
                      {loading ? 'Searching...' : 'Search Prices'}
                    </button>
                  </div>
                </div>

                {/* Quick Suggestions */}
                <div className="text-center">
                  <p className="text-gray-600 mb-3 font-medium">Popular Commodities:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {topSuggestions.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleQuickSearch(item)}
                        className="bg-lime-100 hover:bg-lime-200 text-lime-700 px-4 py-2 rounded-full font-medium transition-colors border border-lime-200 hover:border-lime-300"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mb-2"></div>
                <p className="text-lime-600 font-medium">Fetching latest market data...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-8">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Trending Commodities */}
        {!loading && filteredData.length === 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Trending Commodities</h2>
                <p className="text-gray-600">Current market trends and price movements</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingData.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickSearch(item.name)}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.change >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change_percent).toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Price:</span>
                        <span className="font-bold text-lg">₹{item.current_price}/kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Previous:</span>
                        <span className="text-gray-500">₹{item.previous_price}/kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Change:</span>
                        <span className={item.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {item.change >= 0 ? '+' : ''}₹{item.change}/kg
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search Results */}
        {filteredData.length > 0 && (
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Search Results</h2>
                <p className="text-gray-600">Found {filteredData.length} results for your search</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-green-700">{item.commodity}</h3>
                        <p className="text-sm text-gray-500">{item.variety || 'Standard Grade'}</p>
                      </div>
                      <div className="bg-green-100 p-2 rounded-lg">
                        <span className="text-2xl">🌾</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-lime-50 p-4 rounded-xl border border-green-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-green-600">Modal Price</span>
                          <span className="text-2xl font-bold text-green-700">₹{item.modal_price}</span>
                        </div>
                        <div className="text-xs text-gray-500">per quintal</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Min Price</div>
                          <div className="font-semibold text-gray-700">₹{item.min_price}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Max Price</div>
                          <div className="font-semibold text-gray-700">₹{item.max_price}</div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <span>🏢</span>
                          <span>{item.market}, {item.state}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>📅</span>
                          <span>{new Date(item.arrival_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default MarketSearch;

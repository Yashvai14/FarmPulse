'use client';

import React, { useState } from 'react';
import NavBar from '@/components/navBar';

type PriceData = {
  commodity: string;
  market: string;
  state: string;
  modal_price: string;
  min_price: string;
  max_price: string;
  arrival_date: string;
};

const MarketSearch = () => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setFilteredData([]);

    try {
      const res = await fetch(
        `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd00000156de543a47fe48a779ac21532e574087&format=json&limit=200`
      );

      const data = await res.json();

      // Filter by query
      const results: PriceData[] = data.records.filter((item: PriceData) =>
        item.commodity.toLowerCase().includes(query.toLowerCase()) ||
        item.market.toLowerCase().includes(query.toLowerCase())
      );

      if (results.length === 0) {
        setError('No matching results found.');
        return;
      }

      // Deduplicate results (based on commodity + market)
      const seen = new Set();
      const uniqueResults: PriceData[] = [];

      for (const item of results) {
        const key = `${item.commodity}-${item.market}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueResults.push(item);
        }
        if (uniqueResults.length === 6) break;
      }

      setFilteredData(uniqueResults);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch market data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <NavBar />
    <section className="py-10 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-6xl text-lime-500 font-bold  mb-4">Check Crop Prices</h2>
        <p className="text-gray-600 mb-6">
          Enter your crop or mandi name to get the latest mandi prices.
        </p>

        <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="e.g., Nagpur or Wheat"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            Search
          </button>
        </div>

        {loading && <p className="mt-4 text-green-600">Fetching data...</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>

      {filteredData.length > 0 && (
        <div className="mt-10 max-w-6xl mx-auto flex justify-center gap-6">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="bg-green-100 rounded-xl shadow-md p-6 border border-green-300"
            >
              <h3 className="text-xl font-bold text-green-800 mb-2">{item.commodity}</h3>
              <p className="text-gray-700">
                <strong>Mandi:</strong> {item.market}, {item.state}
              </p>
              <p className="text-gray-700">
                <strong>Modal Price:</strong> ₹{item.modal_price}
              </p>
              <p className="text-gray-700">
                <strong>Min Price:</strong> ₹{item.min_price}
              </p>
              <p className="text-gray-700">
                <strong>Max Price:</strong> ₹{item.max_price}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                📅 {item.arrival_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
    </>
  );
};

export default MarketSearch;

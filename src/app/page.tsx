'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const [errorMessage, setErrorMessage] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  const MAX_LIMIT = 7;

  const regions = [
    {
      id: 'north',
      label: 'North India',
      desc: 'Includes: Delhi, Punjab, Haryana, Himachal Pradesh, J&K, Ladakh, Uttarakhand, UP, Chandigarh'
    },
    {
      id: 'south',
      label: 'South India',
      desc: 'Includes: Andhra Pradesh, Karnataka, Kerala, Tamil Nadu, Telangana, Puducherry, Lakshadweep, Andaman & Nicobar'
    },
    {
      id: 'east',
      label: 'East India',
      desc: 'Includes: West Bengal, Odisha, Jharkhand, Bihar, Sikkim, Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura'
    },
    {
      id: 'west',
      label: 'West India',
      desc: 'Includes: Maharashtra, Gujarat, Rajasthan, Goa, Dadra & Nagar Haveli, Daman & Diu'
    },
    {
      id: 'central',
      label: 'Central India',
      desc: 'Includes: Madhya Pradesh, Chhattisgarh'
    },
  ];

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch('/api/claim');
        const data = await res.json();
        if (data.counts) {
          setCounts(data.counts);
        }
      } catch (e) {
        console.error('Failed to fetch counts:', e);
      } finally {
        setIsLoadingCounts(false);
      }
    }

    fetchCounts();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit() {
    if (!selectedRegion) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: selectedRegion }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong');
        // Refresh counts if we hit a quota error
        if (res.status === 403) {
          const countRes = await fetch('/api/claim');
          const countData = await countRes.json();
          if (countData.counts) setCounts(countData.counts);
        }
      } else {
        window.location.href = data.redirectUrl;
      }
    } catch (e) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      if (status === 'loading') setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans text-black">
      <div className="max-w-3xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200">

        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Research Survey Participation</h1>
          <p className="text-lg text-gray-600 font-medium">Capture "commonsense" knowledge across India</p>
        </div>

        {/* Welcome Message */}
        <div className="prose prose-blue max-w-none text-gray-700 space-y-4 mb-10 leading-relaxed text-base">
          <p className="font-semibold text-gray-900 text-lg">Welcome!</p>
          <p>
            We are inviting you to participate in a unique research study focused on capturing "commonsense" knowledge across different regions of India. Your insights will help AI models better understand the nuances of Indian culture and daily life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                <span className="mr-2">📝</span> The Task
              </h4>
              <p className="text-sm">Answer 60–69 MCQs based on everyday scenarios, traditions, and social norms customized to your region.</p>
            </div>
            <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center">
                <span className="mr-2">💰</span> Time & Pay
              </h4>
              <p className="text-sm">~60 mins total. Compensation: <strong>£6 per hour</strong> (prorated based on completion time).</p>
            </div>
          </div>

          <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 mb-8">
            <h4 className="font-bold text-amber-900 mb-2 flex items-center text-sm">
              <span className="mr-2">🔒</span> Privacy & Data Collection
            </h4>
            <p className="text-xs text-amber-800">
              We only collect your Prolific ID to track responses and process payment. No other PII will be stored. All responses are fully anonymized.
            </p>
          </div>
        </div>

        {/* Example Box */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Example Question:</p>
          <p className="italic text-gray-800 mb-4">
            "In your region, how is an auspicious time for important ceremonies such as weddings typically chosen?"
          </p>
          <ul className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <li className="flex items-start"><span className="text-blue-500 mr-2 font-bold select-none">A)</span> Consulting a Pandit regarding planetary positions...</li>
            <li className="flex items-start"><span className="text-blue-500 mr-2 font-bold select-none">B)</span> Consulting an Iyer/local priest to check the Panchangam...</li>
            <li className="flex items-start"><span className="text-blue-500 mr-2 font-bold select-none">C)</span> Referencing the astrological panjika...</li>
          </ul>
        </div>

        {/* Region Relevance Emphasis Box */}
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-10 text-center animate-pulse">
          <p className="font-black text-red-700 text-lg uppercase tracking-tight">
            PICK THE OPTION THAT IS MOST RELEVANT TO YOUR REGION
          </p>
        </div>

        {/* Region Selector */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            Step 1: Select Your Region
          </h3>
          <p className="text-sm text-gray-500 mb-6">Choose the region you are most familiar with (e.g., where you grew up or currently live).</p>

          <div className="space-y-4">
            {regions.map((r) => {
              const count = counts[r.id] || 0;
              const isFull = count >= MAX_LIMIT;
              const isSelected = selectedRegion === r.id;

              return (
                <label
                  key={r.id}
                  className={`relative flex flex-col md:flex-row md:items-center justify-between p-5 border-2 rounded-xl transition-all ${isFull
                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                    : isSelected
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:border-blue-200 cursor-pointer'
                    }`}
                >
                  <div className="flex items-start mb-2 md:mb-0">
                    <input
                      type="radio"
                      name="region"
                      value={r.id}
                      checked={isSelected}
                      disabled={isFull || status === 'loading'}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-4">
                      <span className={`block font-bold text-lg ${isFull ? 'text-gray-500' : 'text-gray-900'}`}>
                        {r.label}
                      </span>
                      <span className="block text-sm text-gray-500 mt-1 leading-snug">
                        {r.desc}
                      </span>
                    </div>
                  </div>

                  {isFull && (
                    <div className="md:ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        QUOTA FULL
                      </span>
                    </div>
                  )}

                  {!isFull && !isLoadingCounts && (
                    <div className="md:ml-4 flex-shrink-0 text-xs font-medium text-gray-400">
                      {MAX_LIMIT - count} spots left
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          {/* Fallback button for Prolific users when slots are full */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-lg font-bold text-gray-800 mb-3">No slots available for your region?</p>
            <Link
              href="/completion"
              className="w-full py-3 px-6 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-bold text-center hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              None of my region slots have been utilized
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center animate-shake">
            <span className="mr-3 text-lg">⚠️</span>
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedRegion || status === 'loading'}
          className={`w-full py-4 px-6 rounded-xl font-extrabold text-lg shadow-lg transform transition-all active:scale-[0.98] ${!selectedRegion || status === 'loading'
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25'
            }`}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking Availability...
            </span>
          ) : 'Submit & Start Survey'}
        </button>

      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        © 2024 Cultural Research Study India
      </footer>
    </div >
  );
}



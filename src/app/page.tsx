'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const [errorMessage, setErrorMessage] = useState('');

  const regions = [
    { id: 'north', label: 'North India', desc: 'Delhi, Punjab, Haryana, UP...' },
    { id: 'south', label: 'South India', desc: 'Tamil Nadu, Kerala, Karnataka...' },
    { id: 'east', label: 'East India', desc: 'West Bengal, Bihar, Odisha...' },
    { id: 'west', label: 'West India', desc: 'Maharashtra, Gujarat, Rajasthan...' },
    { id: 'central', label: 'Central India', desc: 'Madhya Pradesh, Chhattisgarh' },
  ];

  async function handleSubmit() {
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region: selectedRegion }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong');
      } else {
        // Success! Redirect to the Google Form
        window.location.href = data.redirectUrl;
      }
    } catch (e) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-black">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Research Survey Participation</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Hello,<br/>
          We are reaching out to people to answer a set of questions related to commonsense in India. 
          You will be presented with about 60-69 MCQs specifically tailored to your region. 
          <strong> Compensation: £6/hr (prorated).</strong>
        </p>

        {/* Example Question Box */}
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-8 text-sm text-gray-800">
          <p className="font-semibold mb-2 text-blue-900">Example Question:</p>
          <p className="italic mb-3">
            "In your region, how is an auspicious time for important ceremonies such as weddings typically chosen?"
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>A) Consulting a Pandit regarding planetary positions...</li>
            <li>B) Consulting an Iyer to check the Panchangam...</li>
            <li>C) Referencing the astrological panjika...</li>
          </ul>
        </div>

        {/* Region Selector */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select your region:</h3>
        <div className="space-y-3 mb-8">
          {regions.map((r) => (
            <label 
              key={r.id}
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                selectedRegion === r.id 
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="region"
                value={r.id}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <span className="block font-medium text-gray-900">{r.label}</span>
                <span className="block text-sm text-gray-500">{r.desc}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedRegion || status === 'loading'}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
            !selectedRegion || status === 'loading'
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {status === 'loading' ? 'Checking Availability...' : 'Submit & Start Survey'}
        </button>

      </div>
    </div>
  );
}


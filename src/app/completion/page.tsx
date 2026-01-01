'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Completion() {
    const code = 'CL9MZ262';
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 font-sans text-black">
            <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-3xl">
                    ✅
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your interest!</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    The survey capacity for your region has been reached, or your region is not part of this study. You can use the code below on Prolific to complete your submission.
                </p>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Completion Code</p>
                    <div className="flex items-center justify-center space-x-3">
                        <code className="text-3xl font-mono font-extrabold text-blue-600 tracking-wider">
                            {code}
                        </code>
                        <button
                            onClick={copyToClipboard}
                            className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to survey
                </Link>
            </div>

            <footer className="mt-8 text-gray-400 text-sm">
                © 2024 Cultural Research Study India
            </footer>
        </div>
    );
}

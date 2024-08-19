'use client';

import { useState } from 'react';

export default function Home() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState<any>(null); // Updated type to `any` for flexibility
    const [error, setError] = useState<string | null>(null); // Explicitly typing `error`

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); // Reset error state

        if (isNaN(Number(input)) || Number(input) <= 0) {
            setError('Please enter a valid positive number for the radius.');
            return;
        }

        try {
            const res = await fetch('https://running-krill-amarnathcjd-d8e56e16.koyeb.app/count_nearby_peoples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'chakka',
                    radius: Number(input),
                }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Enter Radius</h1>
            <form className="bg-white shadow-md rounded-lg p-6 max-w-md w-full" onSubmit={handleSubmit}>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Radius:
                    <input
                        type="number"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter radius in meters"
                    />
                </label>
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                    Send
                </button>
            </form>
            {error && (
                <div className="mt-6 bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-bold">Error:</h2>
                    <p>{error}</p>
                </div>
            )}
            {response && !error && (
                <div className="mt-6 bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Response:</h2>
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            <strong>Number of People Nearby:</strong> {response.numberOfPeople || 'N/A'}
                        </p>
                        <p className="text-gray-700">
                            <strong>Additional Info:</strong> {response.additionalInfo || 'No additional info available'}
                        </p>
                        {/* Add more fields if needed */}
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useEffect } from 'react';

export default function Home() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(null);
    const [value, setValue] = useState<String>('');

    const [entries, setEntries] = useState<number>(0);
    const [entrie, setEntrie] = useState<number>(0);

    

    async function detailsform() {
        console.log("helooooo");

        try {
            const res = await axios.get('/api/client');

            console.log("hi");
            setEntries(res.data.expectedentry);
            console.log(res.data.expectedentry);
            console.log(entries);


          
        } catch (e) {
            if (e instanceof AxiosError) {
                console.log((e as AxiosError).response?.data);
            }
        }
    }
    


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setEntrie(12);
        event.preventDefault();

        if (isNaN(Number(input)) || Number(input) <= 0) {
            alert('Please enter a valid positive number for the radius.');
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
                    radius: Number(input)*10,
                }),
            });

            const data = await res.json();
            setResponse(data);
            setValue(data.count);
            console.log('helloo');
            console.log(value);
           
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
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
            {response && (
                <div className="mt-6 bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Response:</h2>
                    <p className="text-gray-700 mb-2">Count:</p>
                    <pre className="text-gray-700 whitespace-pre-wrap break-words">{value}</pre>
                    <p className="text-gray-700 mb-2">Additional Information:</p>
                    <pre className="text-gray-700 ">No Additional Info</pre>
                    <p className="text-gray-700 mb-2">Expected People:</p>
                   
                    <pre className="text-gray-700 whitespace-pre-wrap break-words">{entrie}</pre>

                </div>
            )}
        </div>
    );
}

'use client'
import React, { useEffect } from 'react';
import { CiImageOn } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa6";
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

const Public = () => {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/genai'
    });

    useEffect(() => {
        console.log('Public component mounted');
        console.log(messages); // Debugging to ensure messages are being updated
    }, [messages]);

    return (
        <main>
            {RenderForm()}
        </main>
    );

    function RenderForm() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(event, {
                    data: {
                        prompt: input
                    }
                });
            }}>
                <div className='flex flex-col' id='publicdem'>
                    <div className='flex flex-col mx-12 py-24 px-80'>
                        <h1 className='mb-4 mt-10 lg:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-red-600 inline-block text-transparent bg-clip-text'>
                            Hello, Man
                        </h1>
                        <p className='mb-8 text-gray-500 text-3xl'>
                            <h2>
                                <TypeAnimation
                                    sequence={[

                                        'How can I help you?',
                                        3000,
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    style={{ fontSize: '1em', display: 'inline-block' }}
                                    repeat={Infinity}
                                /></h2>
                        </p>
                        <div className='flex flex-col items-center mt-8 ml-96 '>
                            {messages.map((m, index) => (
                                <div key={index} className={`p-4 shadow-md rounded-md w-1/2 ${m.role === 'user' ? 'bg-black text-gray-500' : 'bg-gray-500 text-black'}`}>
                                    {m.content}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative min-h-screen">
                        <div className="flex justify-center items-center min-h-screen">
                            <div className="flex flex-row w-full fixed bottom-0 left-0 justify-center items-center pb-10">
                                <div className='flex flex-row border-2 border-gray-300 bg-black h-10 px-5 w-1/2 pr-7 rounded-full text-sm focus:outline-none'>
                                    <input
                                        type="text"
                                        className='bg-black text-white w-full h-full outline-none'
                                        placeholder="Enter a prompt here"
                                        value={input}
                                        onChange={handleInputChange}
                                    />
                                    <button type='submit' className='pr-2'><Send /></button>
                                    <div className='flex items-center ml-auto space-x-2'>
                                        <CiImageOn className='text-2xl' />
                                        <FaMicrophone className='pl-2 text-2xl' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default Public;

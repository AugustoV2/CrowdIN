import { time, timeStamp } from 'console';
import React, { useState, useEffect } from 'react';
import { IoTimeSharp } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa6";
import { Send } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { useChat } from 'ai/react';


const Chat = () => {
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
}
const RenderForm = () => {


  const [messages, setMessages] = useState<string[]>([]);
  interface Messages {
    username: string;
    message: string;
  }

  const [alerts, setAlerts] = useState<Messages[]>([]);
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    const sse = new EventSource('https://0ac5-117-239-78-56.ngrok-free.app/chat_web');


    sse.onmessage = (event) => {
      try {
        const data = event.data;

        
        const jsonString = data.replace(/^data:\s*/, "").replace(/'/g, '"');

        // Convert the string to a JavaScript object
        console.log("Received data:", jsonString);
        const dataObject = JSON.parse(jsonString);
        console.log("Parsed data:", dataObject);

        if (dataObject.alerts) {
          setAlerts(dataObject.alerts);
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
        setError("Error parsing data");
      }
    };

    sse.onerror = (event) => {
      console.error("SSE Error:", event);
      setError("Error with SSE connection");
      sse.close();
    };

    // Clean up the SSE connection when the component unmounts
    return () => {
      sse.close();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (input.trim()) {
      try {
        const response = await fetch('https://0ac5-117-239-78-56.ngrok-free.app/add_message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: 300961814,
            message: input,
            user: 'sender',
            timeStamp: 1111, // Using current timestamp
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setInput(''); // Clear input regardless of success or failure
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className='relative'>
      <div className='flex flex-col items-center justify-center min-h-screen bg-black'>
        <div className='flex flex-col w-full max-w-2xl mx-auto py-8 px-4 bg-black shadow-lg rounded-lg'>

          <div className='flex flex-col'>
            {/* Alerts Section */}
            <div className='flex flex-col space-y-4'>
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div
                    className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'} border border-gray-300`}
                    key={index}
                  >
                    <div className='font-semibold text-gray-800'>{alert.username}</div>
                    <div className='text-gray-700'>{alert.message}</div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-center'>No alerts to display</p>
              )}
            </div>
          </div>
        </div>


        <div>
          <form  onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit(event);
                      }}>

            <Button onPress={onOpen} color="primary">Raise</Button>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-black">Raise Your Question</ModalHeader>
                    <ModalBody>
                      <input
                        autoFocus

                       
                        placeholder="Enter Your Question"
                        
                        className=' text-black'
                        value={input}
                        onChange={handleChange}
                      />

                      <div className="flex py-2 px-1 justify-between">


                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary"
                        onPress={() => {  
                          Chat
                            {
                              data: {
                                prompt: input
                              }
                            }
                          
                        }}
                      >
                        Raise
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>

            </form>
        </div>
        <div className="relative min-h-screen">
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-row w-full fixed bottom-0 left-0 justify-center items-center pb-10">
              <div className='flex flex-row border-2 border-gray-300 bg-black h-10 px-5 w-1/2 pr-7 rounded-full text-sm focus:outline-none'>
                <input
                  type="text"
                  className='bg-black text-white w-full h-full outline-none'
                  placeholder="Enter your message here"
                  value={input}
                  onChange={handleChange}
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
};

export default Chat;
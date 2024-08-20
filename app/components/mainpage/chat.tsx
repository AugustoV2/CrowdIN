import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { CiImageOn } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa6";
import { Send } from 'lucide-react';
import { useChat } from 'ai/react';

const Chat = () => {
  const { input, handleInputChange, handleSubmit: aiHandleSubmit } = useChat({
    api: '/api/genai'
  });

  const [alerts, setAlerts] = useState<{ username: string; message: string }[]>([]);
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const sse = new EventSource('https://3fc8ee11474726bc33447804115cb41f.serveo.net/chat_web');
    sse.onmessage = (event) => {
      try {
        const data = event.data.replace(/^data:\s*/, "").replace(/'/g, '"');
        const dataObject = JSON.parse(data);

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

    return () => {
      sse.close();
    };
  }, []);

  const handleSubmitQuestion = async () => {
    if (question.trim()) {
      try {
        const response = await fetch('/api/raise', {
          method: 'POST',
          body: JSON.stringify({
            question,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        setQuestion(''); // Clear input field after submission
        onOpenChange(); // Close modal after submission
      } catch (error) {
        console.error('Failed to send message:', error);
        setError('Failed to send message');
      }
    }
  };

  return (
    <main className="relative">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col w-full max-w-2xl mx-auto py-8 px-4 bg-black shadow-lg rounded-lg">
          <div className="flex flex-col space-y-4">
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

        <Button onPress={onOpen} color="primary">Raise</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-black">Raise Your Question</ModalHeader>
            <ModalBody>
              <input
                autoFocus
                placeholder="Enter Your Question"
                className='text-black w-full'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onOpenChange}>Close</Button>
              <Button color="primary" onPress={handleSubmitQuestion}>
                Raise
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <div className="relative min-h-screen">
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-row w-full fixed bottom-0 left-0 justify-center items-center pb-10">
              <div className='flex flex-row border-2 border-gray-300 bg-black h-10 px-5 w-1/2 pr-7 rounded-full text-sm focus:outline-none'>
                <input
                  type="text"
                  className='bg-black text-white w-full h-full outline-none'
                  placeholder="Enter your message here"
                  value={input}
                  onChange={handleInputChange}
                />
                <button type='submit' className='pr-2' onClick={aiHandleSubmit}><Send /></button>
                <div className='flex items-center ml-auto space-x-2'>
                  <CiImageOn className='text-2xl' />
                  <FaMicrophone className='pl-2 text-2xl' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Chat;

import React, { useState, useEffect } from 'react';

const Approval = () => {
  // State to manage the list of questions
  const [questions, setQuestions] = useState<{ id: number; question: string }[]>([]);
  
  // State to manage notifications
  const [notification, setNotification] = useState<{ message: string; type: string }>({ message: '', type: '' });

  useEffect(() => {
    // Function to fetch questions from the API
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/raise');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Debugging: Log the full API response
        const data = await response.json();
        console.log('API response:', data);

        if (data.success) {
          // Check if data.messages exists and is an array
          if (Array.isArray(data.messages)) {
            // Assuming the messages field contains the questions
            const questionsWithId = data.messages.map((msg: any, index: number) => ({
              id: index + 1, // or any unique identifier from your data
              question: msg.message,
            }));
            setQuestions(questionsWithId);
          } else {
            console.error('Unexpected API response structure:', data);
            setNotification({ message: 'Unexpected API response structure', type: 'error' });
          }
        } else {
          console.error('Failed to fetch questions:', data.error);
          setNotification({ message: 'Failed to fetch questions', type: 'error' });
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setNotification({ message: 'Failed to fetch questions', type: 'error' });
      }
    };

    fetchQuestions();
  }, []);

  // Handler to approve a question
  const handleApprove = (id: number) => {
    setQuestions(questions.filter(question => question.id !== id));
    setNotification({ message: 'Question Approved', type: 'success' });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000); // Clear notification after 3 seconds
  };

  // Handler to reject a question
  const handleReject = (id: number) => {
    setQuestions(questions.filter(question => question.id !== id));
    setNotification({ message: 'Question Rejected', type: 'error' });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000); // Clear notification after 3 seconds
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 bg-black font-sans antialiased">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Questions</h1>

        {notification.message && (
          <div
            className={`px-4 py-2 rounded-lg mb-6 text-center text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        {questions.length > 0 ? (
          questions.map(question => (
            <div key={question.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">{question.question}</h2>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleApprove(question.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => handleReject(question.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500 text-center'>No questions to display</p>
        )}
      </div>
    </div>
  );
};

export default Approval;

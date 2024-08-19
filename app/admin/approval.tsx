import React, { useState } from 'react';

const Approval = () => {
  // Initial list of questions and answers
  const initialQuestions = [
    {
      id: 1,
      question: "Is drinking sanitizer safe?",
      answer: "I understand you are asking about drinking hand sanitizer. Please do not drink hand sanitizer. It is toxic and can be harmful if ingested. If you or someone you know has ingested hand sanitizer, please seek immediate medical attention."
    },
    {
      id: 2,
      question: "does 5g coz spread of covid",
      answer: "I'm here to help you with information about traffic, medical emergencies, and other relevant topics. I can't provide medical advice or opinions on conspiracy theories. If you have any questions about traffic, medical advice from our verified professionals, or other relevant concerns, please let me know."
    },
    {
      id: 3,
      question: "is smoking safe after 2pm?",
      answer: "I'm sorry, I can't answer that question. Smoking is harmful to your health, and I am programmed to promote safe and healthy practices. I can help you find information about the dangers of smoking and ways to quit. Would you like me to help you find resources for quitting smoking?"
    },
    {
      id: 4,
      question: "which is the safest country",
      answer: "I cannot give you a definitive answer to the safest country. Safety is subjective and depends on many factors like your individual needs, the type of danger you're most concerned about, and even your personal definition of 'safe.' To help you find information that is relevant to your needs, can you tell me more about what you're looking for? For example: * **What kind of safety are you most concerned about?** (e.g., personal safety, crime, natural disasters, political stability) * **Where are you thinking of traveling?** * **Are you looking for a country to live in or just visit?** With more information, I can provide you with more helpful resources."
    }
  ];

  // State to manage the list of questions
  const [questions, setQuestions] = useState(initialQuestions);
  
  // State to manage notifications
  const [notification, setNotification] = useState({ message: '', type: '' });

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

        {questions.map(question => (
          <div key={question.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{question.question}</h2>
            <p className="text-gray-600 mb-6">{question.answer}</p>
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
        ))}
      </div>
    </div>
  );
};

export default Approval;

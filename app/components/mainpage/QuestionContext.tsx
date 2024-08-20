// context/QuestionContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface Question {
  id: number;
  question: string;
}

interface QuestionContextType {
  questions: Question[];
  addQuestion: (question: Question) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const QuestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (question: Question) => {
    setQuestions((prevQuestions) => [...prevQuestions, question]);
  };

  return (
    <QuestionContext.Provider value={{ questions, addQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error('useQuestionContext must be used within a QuestionProvider');
  }
  return context;
};

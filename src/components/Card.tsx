import React from 'react';

interface CardProps {
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  centerContent: boolean;
}

const Card: React.FC<CardProps> = ({ title, content, centerContent }) => {
  return (
    <div className="mt-4 w-full overflow-hidden rounded border-2 border-blue-200 bg-gray-800">
      <div
        className={`px-3 py-4 ${
          centerContent && 'flex w-full flex-col items-center justify-center'
        }`}
      >
        <div className="text-2xl font-bold">{title}</div>
        <div className="w-full text-base text-gray-700">{content}</div>
      </div>
    </div>
  );
};

export default Card;

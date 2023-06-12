import React from 'react';

interface CardProps {
  title: string;
  content: string | React.ReactNode;
  centerContent: boolean;
}

const Card: React.FC<CardProps> = ({ title, content, centerContent }) => {
  return (
    <div className="w-full overflow-hidden rounded shadow-lg">
      <div
        className={`px-6 py-4 ${
          centerContent && 'flex flex-col items-center justify-center'
        }`}
      >
        <div className="mb-2 text-xl font-bold">{title}</div>
        <div className="text-base text-gray-700">{content}</div>
      </div>
    </div>
  );
};

export default Card;

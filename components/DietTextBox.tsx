'use client';

import React, { FC, useState } from 'react';

interface DietEntryProps {
  onDietChange: (diet: string) => void;
}

const DietEntry: FC<DietEntryProps> = ({ onDietChange }) => {
  const [dietString, setDietString] = useState<string>('');

  const handleSubmit = () => {
    onDietChange(dietString);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Please enter your diet details</p>
      <textarea
        className="w-full max-w-md p-2 border border-gray-300 rounded-md"
        value={dietString}
        onChange={(e) => setDietString(e.target.value)}
      ></textarea>
      <button
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
          setDietString('');
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default DietEntry;

import React, { FC, useState } from 'react';

interface DietEntryProps {
  onDietChange: (diet: string) => void;
}

const DietEntry: FC<DietEntryProps> = ({ onDietChange }) => {
  const [dietString, setDietString] = useState<string>('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 text-center bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md px-5 text-center bg-white rounded-lg shadow py-7 app">
        <h2 className="mb-4 text-2xl font-extrabold text-center text-gray-900">
          Please enter your diet details
        </h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dietString}
          onChange={(e) => setDietString(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onDietChange(dietString);
              setDietString('');
            }
          }}
        ></textarea>
        <button
          className="items-center justify-center px-5 py-3 mt-6 text-base font-medium text-white bg-blue-500 border border-transparent rounded-md w-400 hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            onDietChange(dietString);
            setDietString('');
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DietEntry;

import React, { FC, useState } from 'react';
import { MacroResults } from '../app/page';
import { FiCopy } from 'react-icons/fi';

interface ResultsProps {
  results: MacroResults | null;
}

const Results: FC<ResultsProps> = ({ results }) => {
  const [copySuccess, setCopySuccess] = useState<string>('');

  const handleCopy = () => {
    setCopySuccess('Copied to Clipboard!');
    setTimeout(() => setCopySuccess(''), 2000); // Reset the 'Copied' message after 2 seconds.
  };

  const resultString = `Calories: ${results?.calories}\nProtein: ${results?.protein}\nFat: ${results?.fat}\nCarbs: ${results?.carbs}`;

  return (
    <>
      {results && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gray-100 sm:px-6 lg:px-8">
          <div className="w-full max-w-md px-5 bg-white rounded-lg shadow app py-7">
            <h2 className="mb-4 text-2xl font-extrabold text-center text-gray-900">
              Macros for the day:
            </h2>
            <div className="prose-sm prose text-center sm:prose lg:prose-lg">
              <p>Calories: {results.calories}</p>
              <p>Protein: {results.protein}</p>
              <p>Fat: {results.fat}</p>
              <p>Carbs: {results.carbs}</p>
            </div>
            <div className="mt-6 text-center">
              <button className="items-center justify-center px-6 py-2 font-medium text-white bg-blue-500 border border-transparent rounded-md w-400 hover:bg-blue-600">
                Copy <FiCopy className="inline" />
              </button>
            </div>
            {copySuccess && (
              <p className="mt-3 text-sm text-center text-green-500">
                {copySuccess}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Results;

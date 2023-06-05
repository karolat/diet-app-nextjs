import React, { FC } from 'react';
import { MacroResults } from '../app/page'

interface ResultsProps {
  results: MacroResults | null;
}

const Results: FC<ResultsProps> = ({ results }) => {
  return (
    <>
      {results && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="mb-4 text-2xl font-bold">Macros for the day:</p>
          <p className="">
            Calories: {results.calories}
            <br />
            Protein: {results.protein}
            <br />
            Fat: {results.fat}
            <br />
            Carbs: {results.carbs}
          </p>
        </div>
      )}
    </>
  );
};

export default Results;
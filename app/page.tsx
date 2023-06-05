'use client';

import DietEntry from '../components/DietEntry';
import Results from '../components/Results';
import React, { FC, useState } from 'react';

export interface MacroResults {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

const Home: FC = () => {
  const [results, setResults] = useState<MacroResults | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] =
    useState<boolean>(false);

  const handleDietChange = (newDiet: string) => {
    setIsWaitingForResponse(true);
    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newDiet }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(JSON.parse(data.completion));
        setIsWaitingForResponse(false);
      });
  };

  return (
    <div>
      {results ? (
        <Results results={results} />
      ) : isWaitingForResponse ? (
        <p>WAITING FOR RESPONSE</p>
      ) : (
        <DietEntry onDietChange={handleDietChange} />
      )}
    </div>
  );
};

export default Home;

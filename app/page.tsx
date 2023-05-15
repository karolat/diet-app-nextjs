'use client';

import DietEntry from '../components/DietTextBox';
import React, { FC, useState } from 'react';

interface MacroResults {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

const Home: FC = () => {
  const [diet, setDiet] = useState<string>('');
  const [results, setResults] = useState<MacroResults | null>(null);

  const handleDietChange = (newDiet: string) => {
    setDiet(newDiet);
    console.log(`New diet: ${newDiet}`);

    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newDiet }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.completion);
        setResults(JSON.parse(data.completion));
      })
    }


  return (
    <div>
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
      <DietEntry onDietChange={handleDietChange} />
    </div>
  );
}

export default Home;
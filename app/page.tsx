'use client';

import DietEntry from '../components/DietTextBox';
import React, { FC, useState } from 'react';

const Home: FC = () => {
  const [diet, setDiet] = useState<string>('');
  const [results, setResults] = useState<string>('');

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
        setResults(data.completion);
      })
    }


  return (
    <div>
      {results && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="mb-4 text-2xl font-bold">Your new diet:</p>
          <p className="w-full max-w-md p-2 border border-gray-300 rounded-md">
            {results}
          </p>
        </div>
      )}
      <p className='items-center align-justify-center'>{results}</p>
      <DietEntry onDietChange={handleDietChange} />
    </div>
  );
}

export default Home;
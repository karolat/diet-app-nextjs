'use client';

import DietEntry from '../components/DietEntry';
import Results from '../components/Results';
import React, { FC, useState } from 'react';

export interface FoodItem {
  n: string;
  kc: number;
  f: number;
  p: number;
  c: number;
}

export type Diet = FoodItem[];

export interface MacroResults {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

const sumMacroResults = (diet: Diet): MacroResults => {
  const results = {
    calories: 0,
    fat: 0,
    protein: 0,
    carbs: 0,
  };

  diet.forEach(({ kc, f, p, c }) => {
    results.calories += kc;
    results.fat += f;
    results.protein += p;
    results.carbs += c;
  });

  return {
    calories: results.calories.toString(),
    fat: results.fat.toString(),
    protein: results.protein.toString(),
    carbs: results.carbs.toString(),
  };
};

const Home: FC = () => {
  const [results, setResults] = useState<MacroResults | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] =
    useState<boolean>(false);

  const handleDietChange = (newDiet: string) => {
    const lines = newDiet.split('\n');

    // Process each line: remove extra spaces and convert to lowercase
    const formattedLines = lines.map((line) =>
      line.replace(/\s+/g, ' ').toLowerCase()
    );

    // Replace lines that only contain a number
    const filteredLines = formattedLines.filter(
      (line) => !/^\s*[\d,]*\s*$/.test(line)
    );

    console.log(filteredLines);

    setIsWaitingForResponse(true);

    const requests = filteredLines.map((line) =>
      fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: line }),
      })
        .then((response) => response.json())
        .then((data) => JSON.parse(data.completion) as Diet)
    );
    console.log(requests);

    Promise.all(requests)
      .then((diets) => {
        const results = {
          calories: 0,
          fat: 0,
          protein: 0,
          carbs: 0,
        };

        diets.forEach((diet) => {
          const sumResults = sumMacroResults(diet);
          results.calories += parseFloat(sumResults.calories);
          results.fat += parseFloat(sumResults.fat);
          results.protein += parseFloat(sumResults.protein);
          results.carbs += parseFloat(sumResults.carbs);
        });

        setResults({
          calories: results.calories.toString(),
          fat: results.fat.toString(),
          protein: results.protein.toString(),
          carbs: results.carbs.toString(),
        });
        setIsWaitingForResponse(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {results ? (
        <Results results={results} />
      ) : isWaitingForResponse ? (
        <div className="flex items-center justify-center h-screen">
          <p className="">WAITING FOR RESPONSE</p>
        </div>
      ) : (
        <DietEntry onDietChange={handleDietChange} />
      )}
    </div>
  );
};

export default Home;

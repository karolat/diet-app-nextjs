import React, { FC } from 'react';

const DietEntry: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Please enter your diet details</p>
      <textarea className="w-full max-w-md p-2 border border-gray-300 rounded-md"></textarea>
      <button className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Submit</button>
    </div>
  );
}

export default DietEntry
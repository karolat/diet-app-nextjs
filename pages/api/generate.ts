const { Configuration, OpenAIApi } = require('openai');
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Get the text from the request body
      const { text } = req.body;

      // Include the text in the prompt
      const prompt = `Parse a list of food items and return a json response of the nutrional macro nutrients amounts for the items listed.  If an item item is listed multiple times, sum the subsequent listings to the macros totals.  List total calories, fat, protein, and carbs.  Some items might not have calories listed after their text, if this is the case, estimate the macros for that food item, assuming a large portion.  If the item as a number after it by itself, that number is the amount of calories.  If the item has a number with p after it, like '90p', that is the amount of protein for that item.  If there is a date listed, ignore it.\n\n### Example Input 1 ###\n2 May\n\nPeanut butter and jam overnight oats\n\n### Example Output 1 ###\n{\n  \"calories\": \"731\",\n  \"fat\": \"33\",\n  \"protein\": \"20\",\n  \"carbs\": \"104\"\n}\n\n### Example Input 2 ###\n2 May\n\nPeanut butter and jam overnight oats\n\nCheese stick 80\nCheese stick 80\n\n### Example Output 2 ###\n{\n  \"calories\": \"891\",\n  \"fat\": \"45\",\n  \"protein\": \"34\",\n  \"carbs\": \"104\"\n}\n\n### Input ###\n${text}### Output ###`;

      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt, // your prompt here
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // Extract the text of the first choice in the response
      const completion = response.data.choices[0].text;

      // Send the completion in the response of your endpoint
      res.status(200).json({ completion });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          },
        });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

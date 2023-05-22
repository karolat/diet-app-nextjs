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
      const prompt = `Parse a list of food items and return a JSON response of the nutritional macro nutrient amounts for the items listed. If an item is listed multiple times, sum the subsequent listings to the macro totals. List total calories, fat, protein, and carbs. Some items might not have calories listed after their text, if this is the case, estimate the macros for that food item, assuming a large portion. If the item has a number after it by itself like 'pizza 500', that number is the amount of calories (500 in this case). If the item has a number with a 'p' after it, like '90p', that is the amount of protein for that item (90 in this case). If there is a date listed, ignore it. Always assume all values are in grams for protein, fat, and carbs, and in kcal for calories.\n\n### Example Input 1 ###\n2 May\n\nPeanut butter and jam overnight oats\n\n### Example Output 1 ###\n{\n  \"calories\": \"731\",\n  \"fat\": \"33\",\n  \"protein\": \"20\",\n  \"carbs\": \"104\"\n}\n\n### Example Input 2 ###\n2 May\n\nPeanut butter and jam overnight oats\n\nCheese stick 80\nCheese stick 80\n\n### Example Output 2 ###\n{\n  \"calories\": \"891\",\n  \"fat\": \"45\",\n  \"protein\": \"34\",\n  \"carbs\": \"104\"\n}\n\n### Example Input 3 ###\ncheese stick 120\ncheese stick 120\ncheese stick 120\n\n### Example Output 3 ###\n{\n  \"calories\": \"360\",\n  \"fat\": \"12\",\n  \"protein\": \"14\",\n  \"carbs\": \"0\"\n}\n\n### Input ###\n${text}\n### Output ###\n{\n  \"calories\": \"620\",\n  \"fat\": \"20\",\n  \"protein\": \"34\",\n  \"carbs\": \"0\"\n}",\n\n### Example Input 1 ###\n2 May\n\nPeanut butter and jam overnight oats\n\n### Example Output 1 ###\n{\n  \"calories\": \"731\",\n  \"fat\": \"33\",\n  \"protein\": \"20\",\n  \"carbs\": \"104\"\n}\n\n### Example Input 2 ###\n2 May\n\nPeanut butter and jam overnight oats\n\nCheese stick 80\nCheese stick 80\n\n### Example Output 2 ###\n{\n  \"calories\": \"891\",\n  \"fat\": \"45\",\n  \"protein\": \"34\",\n  \"carbs\": \"104\"\n}\n\n### Input ###\n${text}### Output ###`;

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

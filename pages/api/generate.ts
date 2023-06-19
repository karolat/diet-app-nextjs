const { Configuration, OpenAIApi } = require('openai');
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      console.log('started')
      // Get the text from the request body
      const { text } = req.body;

      // Include the text in the prompt
      const prompt = `Parse a list of food items and return a json response estimating the nutritional macronutrient amounts for each of the items listed.  If an item item is listed multiple times, list it multiple times.  List total calories, fat, protein, and carbs per item.  Some items might not have calories listed after their text; if this is the case, estimate the macros for that food item, assuming a large portion.  If the item as a number after it by itself, that number is the amount of calories.  If the item has a number with p after it, like '90p', that is the amount of protein for that item.  If there is a date listed, ignore it.

### Example Input 1 ###
2 May
Peanut butter and jam overnight oats
Cheese stick 80
Cheese stick 80

### Example Output 1 ###
[{"n":"Peanut butter and jam overnight oats","kc":400,"f":20,"p":20,"c":30},{"n":"Cheese stick","kc":160,"f":10,"p":12,"c":6},{"n":"Cheese stick","kc":160,"f":10,"p":12,"c":6}]

### Input ###
21 May, 23
Yerba mate 120
p bar 350
470
Yerba mate 60
p bar 350
salad 300
blt sandwich 500
baguette 150
lemonade 170
2,000

### Example Output 2 ###
[{"n":"Yerba mate","kc":120,"f":0,"p":0,"c":31},{"n":"p bar","kc":350,"f":9,"p":30,"c":46},{"n":"Yerba mate","kc":60,"f":0,"p":0,"c":15},{"n":"p bar","kc":350,"f":9,"p":30,"c":46},{"n":"salad","kc":300,"f":15,"p":15,"c":30},{"n":"blt sandwich","kc":500,"f":30,"p":20,"c":40},{"n":"baguette","kc":150,"f":1.5,"p":6,"c":27},{"n":"lemonade","kc":170,"f":0,"p":0,"c":42}]

### Input ###
${text}

### Output ###`;

      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt, // your prompt here
        temperature: 0,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // Extract the text of the first choice in the response
      const completion = response.data.choices[0].text;
      console.log(completion);
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

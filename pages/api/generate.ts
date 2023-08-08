import { kv } from '@vercel/kv';
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
      console.log('started');
      // Get the text from the request body
      const { text } = req.body;

      // Check if they result is cached
      const cachedResult = await kv.get(text);

      if (cachedResult) {
        console.log(`Cached result found for ${text}: ${JSON.stringify(cachedResult)}`)
        res.status(200).json({ completion: JSON.stringify(cachedResult) });
        return;
      }

      // Include the text in the prompt
      const systemMessage = `Parse string of a food item and return a json response estimating the nutritional macronutrient amount for the item.  List total calories, fat, protein, and carbs per item as kc, f, p, and c respectively.  Some items might not have calories listed after their text; if this is the case, estimate the macros for that food item, assuming a large portion.  If the item has a number with p after it, like '90p', that is the amount of protein for that item.  If a date is input, return an empty json object.

### Example Input 1 ###
Peanut butter and jam overnight oats

### Example Output 1 ###
{"n":"Peanut butter and jam overnight oats","kc":400,"f":20,"p":20,"c":30}

### Example Input 2 ###
cheese stick

### Example Output 2 ###
{\"n\":\"cheese stick\",\"kc\":80,\"f\":6,\"p\":5,\"c\":0}

### Example Output 3 ###
p bar 350 p 20

### Example Output 3 ###
{"n":"p bar","kc":350,"f":9,"p":20,"c":46}

### Example Input 4 ###
philadelphia roll

### Example Output 4 ###
{"n":"philadelphia roll","kc":350,"f":12,"p":14,"c":50}

###  Example Output 5 ###
29 July

### Example Output 5 ###
{}
`;

      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // const response = await openai.createCompletion({
      //   model: 'text-davinci-003',
      //   prompt: prompt, // your prompt here
      //   temperature: 0,
      //   max_tokens: 2000,
      //   top_p: 1,
      //   frequency_penalty: 0,
      //   presence_penalty: 0,
      // });

      // Extract the text of the first choice in the response
      const completion = response.data.choices[0].message.content;
      console.log(`Completion: ${completion}`)

      // Cache the result
      await kv.set(text, completion);

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

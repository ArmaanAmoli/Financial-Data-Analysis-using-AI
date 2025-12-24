import { OpenRouter } from "@openrouter/sdk";
import { restClient } from "@massive.com/client-js";
import "dotenv/config";
const openrouter = new OpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY
});


// Testing API link

const stream = await openrouter.chat.send({
  model: "deepseek/deepseek-r1-0528:free",
  messages: [
    {
      "role": "user",
      "content": "APPL current price"
    }
  ],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
// console.log(typeof(stream))
// console.log(stream)
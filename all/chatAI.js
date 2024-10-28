const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateResponseWithContext(userQuery, branchData) {

    const context = `Here is some information about our branches: ${branchData
    .map((branch) => {
      return `Branch Name: ${branch.branchName}, Products: ${Object.entries(
        branch.products
      )
        .map(([product, price]) => `${product}: ${price} TL`)
        .join(", ")}.`;
    })
    .join(" ")}`;

  const prompt = `The user asked: "${userQuery}". Your task is to assist the user as a helpful restaurant assistant. Use the provided information to answer the question accurately, considering product availability, pricing, location, and any other relevant details. If applicable, suggest similar products, recommend popular items, or provide alternatives that best suit the user's needs. Make sure to extract and understand the intent behind the user's question to deliver the most useful and informative response.`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful restaurant chatbot." },
        { role: "user", content: context },
        { role: "user", content: prompt },
      ],
    });
    const tokensUsed = completion.usage.total_tokens;
    console.log(`Tokens used in this API interaction: ${tokensUsed}`);
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating response:", error.message);
    return "Sorry there was an error generating the response! Please try again.";
  }
}

module.exports = { generateResponseWithContext };

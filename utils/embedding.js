const { OpenAIEmbeddingFunction } = require('chromadb');

const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
    model: "text-embedding-ada-002" 
});

async function generate_embedding(text) {
    try {
        const embeddings = await embeddingFunction.generate([text]);
        return embeddings[0];
    } catch (error) {
        console.error('Error generating embeddings:', error.message);
        return null;
    }
}

module.exports = { generate_embedding };
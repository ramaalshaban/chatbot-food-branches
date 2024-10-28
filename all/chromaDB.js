const { ChromaClient, OpenAIEmbeddingFunction } = require('chromadb');
const { generate_embedding } = require('../utils/embedding');

require('dotenv').config(); 

const client = new ChromaClient({ path: 'http://localhost:8000' });

const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
    model: "text-embedding-ada-002"
});


async function getOrCreateCollection() {
    try {
        const collection = await client.getOrCreateCollection({
            name: 'restaurant_branches',
            embeddingFunction: embeddingFunction
        });

        // console.log('---> Collection ready:', collection.name);
        return collection;
    } catch (error) {
        console.error('Error getting or creating ChromaDB collection:', error.message);
        return null;
    }
}

async function populateChromaDB() {
    const branches = require('./branches').getBranches(); 
    const collection = await getOrCreateCollection();

    if (!collection) {
        console.error('Failed to create or retrieve collection. Ensure ChromaDB is running.');
        return;
    }

    for (const branch of branches) {
        try {
            const embedding = await generate_embedding(branch.name + ' ' + branch.location);
            if (embedding) {
                console.log(`Generated embedding for branch: ${branch.name}`);
                await collection.add({
                    documents: [JSON.stringify(branch.products)],
                    metadatas: [{ branchName: branch.name, location: branch.location }],
                    embeddings: [embedding[0]],
                    ids: [branch.name],
                });
                console.log(`Successfully added branch ${branch.name} to ChromaDB.`);
            } else {
                console.error(`Failed to generate embedding for branch: ${branch.name}`);
            }
        } catch (error) {
            console.error(`Error adding branch ${branch.name} to ChromaDB:`, error.message);
        }
    }
}

async function queryBranch(userQuery) {
    try {
        const collection = await getOrCreateCollection(); 
        const embedding = await generate_embedding(userQuery);
        
        if (!embedding) {
            console.error('Failed to generate embedding for query.');
            return null;
        }

        const response = await collection.query({
            queryEmbeddings: [embedding[0]],
            n_results: 5 
        });

        // console.log('---> Raw response:', response);


        if (response && response.documents && response.documents.length > 0) {
            return response.documents[0].map((doc, index) => {
                const branch = JSON.parse(doc);
                return {
                    branchName: response.metadatas[0][index].branchName,
                    location: response.metadatas[0][index].location,
                    products: branch
                };
            });
        } else {
            console.log('Sorry we could not find this query as relevant!');
            return null;
        }
    } catch (error) {
        console.error('Error querying ChromaDB:', error);
        return null;
    }
}

module.exports = { populateChromaDB, queryBranch, getOrCreateCollection };
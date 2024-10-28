const readline = require('readline');
require('dotenv').config();

const { populateChromaDB, getOrCreateCollection, queryBranch } = require('./services/chromaDB');
const { generateResponseWithContext } = require('./services/chatAI');
const { preprocessQuery, isRelevantQuery } = require('./services/preprocess');

async function startChatbot() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Welcome to our restaurant chatbot!');

  rl.question('How can I assist you today?: ', async (userQuery) => {

    const processedQuery = preprocessQuery(userQuery);


    if (!isRelevantQuery(processedQuery)) {
      console.log('\nPlease provide a question related to branch, product, or order information.');
      rl.close();
      return;
    }

    const branchesData = await queryBranch(processedQuery);

    if (branchesData) {

const response = await generateResponseWithContext(processedQuery, branchesData);

      console.log(`\nChatbot: ${response}`);

      rl.question('\nPlease specify the product(s) you would like to order (comma-separated): ', async (products) => {
        const selectedProducts = products.split(',').map(product => product.trim());

        rl.question('\nPlease specify the branch for each product (comma-separated, in same order as products): ', (branches) => {
          const selectedBranches = branches.split(',').map(branch => branch.trim());

          if (selectedProducts.length !== selectedBranches.length) {
            console.log('\nThe number of products and branches must match.');
            rl.close();
            return;
          }

     rl.question('\nWould you like Delivery or Pickup?: ', (serviceType) => {
     
       const service = serviceType.toLowerCase() === 'delivery' ? 'Delivery' : 'Pickup';

            console.log('\nOrder Summary:');
            const ordersByBranch = {};

            for (let i = 0; i < selectedProducts.length; i++) {
              const product = selectedProducts[i];
              const branch = selectedBranches[i];

              if (!ordersByBranch[branch]) {
                ordersByBranch[branch] = [];
              }
              ordersByBranch[branch].push(product);
            }

            Object.entries(ordersByBranch).forEach(([branch, products]) => {
              console.log(`\nBranch: ${branch}`);
              products.forEach(product => {
                console.log(`- Product: ${product}`);
              });
            });
            console.log(`Service Type: ${service}`);

            rl.question('\nDo you confirm this order? (yes/no): ', (confirmation) => {
              if (confirmation.toLowerCase() === 'yes') {
                console.log('\nThank you! Your order has been placed successfully.');
              } else {
                console.log('\nOrder cancelled. Please let us know if you need anything else.');
              }
              rl.close();
            });
          });
        });
      });
    } else {
      console.log('\nSorry we could not find any relevant information!');
      rl.close();
    }
  });
}

(async () => {
  await populateChromaDB();

  const collection = await getOrCreateCollection();
  if (!collection) {
    console.error('Failed to initialize ChromaDB collection. Please ensure ChromaDB is running.');
    process.exit(1);
  }

  startChatbot();
})();

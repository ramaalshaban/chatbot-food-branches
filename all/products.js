const { generateResponse } = require('./chatAI');

async function handleProductSelection(branchName, product, products) {
  if (products[product]) {
    const response = await generateResponse(`I would like to order ${product} from ${branchName}.`);
    console.log(`\nChatbot: ${response}`);
  } else {
    console.log(`\nSorry, ${product} is not available at ${branchName}.`);
  }
}

module.exports = { handleProductSelection };

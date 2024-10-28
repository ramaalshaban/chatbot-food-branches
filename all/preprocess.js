function preprocessQuery(query) {
    query = query.trim().replace(/\s+/g, ' ');
  
    query = query.toLowerCase();
  
    const stopwords = ['the', 'is', 'at', 'which', 'on', 'for', 'and', 'a'];
    query = query.split(' ')
      .filter(word => !stopwords.includes(word))
      .join(' ');
  
    return query;
  }
  
  function isRelevantQuery(query) {
    const relevantKeywords = ['branch', 'order', 'product', 'menu', 'price', 'location', 'buy', 'availability'];
    return relevantKeywords.some(keyword => query.includes(keyword));
  }
  
  module.exports = { preprocessQuery, isRelevantQuery };
  
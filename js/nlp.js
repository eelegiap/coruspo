const natural = require('natural');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

function preprocessPoems(poems) {
    const tokenizer = new natural.WordTokenizer();

    return poems.map(poem => {
        const tokens = tokenizer.tokenize(poem.text.toLowerCase());
        const lemmatizedTokens = tokens.map(token => natural.PorterStemmer.stem(token));
        return { ...poem, tokens: lemmatizedTokens };
    });
}

function calculateTfIdf(lemmatizedPoems) {
    lemmatizedPoems.forEach((poem, i) => {
        tfidf.addDocument(poem.tokens, i.toString());
    });
}

function preprocessPoems(poems) {
    const tokenizer = new natural.WordTokenizer();

    return poems.map(poem => {
        const tokens = tokenizer.tokenize(poem.text.toLowerCase());
        const lemmatizedTokens = tokens.map(token => natural.PorterStemmer.stem(token));
        return { ...poem, tokens: lemmatizedTokens };
    });
}

function calculateTfIdf(lemmatizedPoems) {
    lemmatizedPoems.forEach((poem, i) => {
        tfidf.addDocument(poem.tokens, i.toString());
    });
}

function cosineSimilarity(vecA, vecB) {
    const dotProduct = (vecA, vecB) => {
        return vecA.reduce((sum, value, i) => sum + (value * vecB[i]), 0);
    };
    const magnitude = (vec) => {
        return Math.sqrt(vec.reduce((sum, value) => sum + (value * value), 0));
    };

    return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}

function findSimilarPoems(targetPoemIndex, lemmatizedPoems, topN = 10) {
    const targetVector = tfidf.getDocumentVector(targetPoemIndex);
    const similarityScores = lemmatizedPoems.map((poem, i) => {
        const compareVector = tfidf.getDocumentVector(i);
        return { index: i, similarity: cosineSimilarity(targetVector, compareVector) };
    });

    return similarityScores
        .filter(score => score.index !== targetPoemIndex)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topN);
}

const poems = [
    { title: 'Poem 1', text: 'Your poem text here' },
    { title: 'Poem 2', text: 'Your poem text here' },
    // ...more poems
];


// const poems = [
//     { title: 'Poem 1', text: 'Your poem text here' },
//     { title: 'Poem 2', text: 'Your poem text here' },
//     // ...more poems
// ];
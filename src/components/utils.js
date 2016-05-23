function parseSentenceForNumber(sentence) {
    var matches = sentence.match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
    return matches && matches[0] || null;
}
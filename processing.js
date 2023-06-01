import { denormalizeValue, normalizeValue } from "./math.js";

const PUNCTUATION_RGX = /[^\w\s]|_/g;

export const processString = word => word.replace(PUNCTUATION_RGX, '').toLowerCase();

export const prepareInput = (input, { maxWords }) => {
    let words = input.split(/\s+/).map(word => processString(word));

    if(words.length < maxWords) {
        const diff = maxWords - words.length;
        const padding = [...new Array(diff)].map((_) => '');
        words = words.concat(...padding);
    }

    return words;
}

export const normalizePrompt = (words, { uniqueWords }) => words.map(word => {
    const uIndex = uniqueWords.indexOf(word);

    return normalizeValue(uIndex, 0, uniqueWords.length);
});

export const preparePrompt = (string, options) => normalizePrompt(prepareInput(string, options), options);

export const getResponse = (output, { responses }) => {
    const denormalizedValue = denormalizeValue(output, 0, responses.length - 1);

    console.log(denormalizedValue, Math.round(denormalizedValue))

    return responses[Math.round(denormalizedValue)];
};
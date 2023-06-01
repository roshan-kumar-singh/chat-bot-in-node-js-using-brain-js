import brain from 'brain.js';
import { writeFileSync } from 'fs';

import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { normalizeValue } from './math.js';
import { normalizePrompt, prepareInput } from './processing.js';

const currentDirectory = cwd();

const loadTrainingData = async () => {
    const file = await readFile(join(currentDirectory, 'intents.json'));
    const json = JSON.parse(file.toString());

    return json;
};

const main = async () => {
    const raw = await loadTrainingData();
    const responses = raw.map(({ response }) => response);

    const normalizedResponses = responses.map((_, i) => normalizeValue(i, 0, responses.length - 1));

    const maxWords = 50;

    const WORDS = [''];

    const intents = raw
        .map(({ intents }) => intents.map(intent => {
            const words = prepareInput(intent, { maxWords });

            words.forEach(word => WORDS.push(word));

            return words;
        }));

    const UNIQUE_WORDS = [...new Set(WORDS)];

    const options = {
        responses,
        normalizedResponses,
        uniqueWords: UNIQUE_WORDS,
        maxWords,
    };

    const normalizedTrainingData = intents.map(entry => {
        return entry.map(words => normalizePrompt(words, options))
    });

    const trainingData = normalizedTrainingData.map((entry, i) => {
        const output = normalizedResponses[i];
        
        return entry.map(input => {
            return { input, output: [output] }
        });
    }).flat();

    const config = {
        binaryThresh: 0.0000001,
        hiddenLayers: [3],
        activation: 'sigmoid',
    };

    const net = new brain.NeuralNetwork(config);

    console.log(net.train(trainingData));

    writeFileSync(join(currentDirectory, 'chatbot-model.json'), JSON.stringify({
        options,
        model: net.toJSON(),
    }));
};

main();
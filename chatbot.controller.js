import { NeuralNetwork } from 'brain.js';
import { getResponse, preparePrompt } from "./processing.js";
import { readFileSync } from 'fs';

const { model, options } = JSON.parse(readFileSync('./chatbot-model.json').toString());

const net = new NeuralNetwork().fromJSON(model);

const chatbot = async (req, res) => {
    try {
        const output = net.run(preparePrompt(req.body.prompt, options));

        const response = getResponse(output, options);

        return res.status(200).send({ response });
    } catch(e) {
        console.error(e);
        return res.status(500).send({ message: 'Could not generate response' });
    }
};

export default chatbot;
import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';

import chatbot from './chatbot.controller.js';

const app = express();

const PORT = 8080;

app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.status(200).send({ message: 'OK' });
});

app.post('/', chatbot);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
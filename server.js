const express = require('express');
const fileUpload = require('fileUpload');
const TokenGenerator = require('uuid-token-generator');
const fs = require('fs');

const app = express();
const tokenGenerator = new TokenGenerator();

app.use(express.static('public'));

app.use(fileUpload());

const processorInputPath = '/processor/input/';
const processorOutPath = '/processor/output/';

/**
 * Get the status for a task token as string. If it is finished,
 * the response is a download link to the processed file.
 */
app.get('/status/:token', (req, res) => {
    let token = req.params.token;

    if(fs.existsSync(processorOutPath + token)) {
        //TODO: create actual link.
        res.status(201).send('Link');
    }
    else {
        if(fs.existsSync(processorInputPath + token)) {
            res.status(200).send('queue');
        }
        else {
            res.status(404).send('No task with token ' + token + ' found');
        }
    }
});

/**
 * Receives a sound file from the client. The file should be named 'input'.
 * See https://www.npmjs.com/package/express-fileupload for more information.
 * Responds with a token for the task in queue.
 */
app.post('/upload', (req, res) => {
    if(!req.files.input || !req.files) {
        return res.status(400).send("No files in request.");
    }

    let inputFile = req.files.input;

    let token = tokenGenerator.generate();
    inputFile.mv('/processor/input/'+token);

    req.status(202).send(token);
});

app.listen(3000, () => console.log("Running on port 3000"));
const express = require('express');
const fileUpload = require('express-fileupload');
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
        return res.status(201).send('Link');
    }
    else {
        if(fs.existsSync(processorInputPath + token)) {
            return res.status(200).send('queue');
        }
        else {
            return res.status(404).send('No task with token ' + token + ' found');
        }
    }
});

/**
 * Receives a sound file from the client. The file should be named 'file'.
 * See https://www.npmjs.com/package/express-fileupload for more information.
 * Responds with a token for the task in queue.
 */
app.post('/upload', (req, res) => {
    if(!req.files.file || !req.files) {
        return res.status(400).send("No files in request.");
    }

    let inputFile = req.files.file;

    let token = tokenGenerator.generate();
    inputFile.mv('./processor/input/' + token, (err) => {
        if (err)
            return res.status(500).send(err);
        return res.status(202).send(token);
    });
});

app.listen(8000, () => console.log("Running on port 8000"));
const express = require('express');
const fileUpload = require('fileUpload');
const TokenGenerator = require('uuid-token-generator');

const app = express();
const tokenGenerator = new TokenGenerator();

app.use(express.static('public'));

app.use(fileUpload());

/**
 * 
 */
app.get('/:token', (req, res) => {
    
});

/**
 * Receives a sound file from the client.
 */
app.post('/upload', (req, res) => {
    if(!req.files.input || !req.files) {
        return res.status(400).send("No files in request.");
    }

    let inputFile = req.files.input;

    let token = tokenGenerator.generate();

    inputFile.mv('/processor/input/'+token);

});

app.listen(3000, () => console.log("Running on port 3000"));
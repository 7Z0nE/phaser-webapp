const express = require('express');
const fileUpload = require('express-fileupload');
const TokenGenerator = require('uuid-token-generator');
const spawn = require('child_process').spawn;
const fs = require('fs');
const util = require('util');

const processorPath = '/processor/';
const processorExec = processorPath + 'processor.sh';
const processorQueuePath = 'processor/queue/';
const processorOutPath = 'processor/finished/';

const app = express();
const tokenGenerator = new TokenGenerator();

app.use(express.static('public'));

app.use(fileUpload());

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
        if(fs.existsSync(processorQueuePath + token)) {
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
    
    console.log("upload: " + JSON.stringify(req.body));

    let inputFile = req.files.file;

    let token = tokenGenerator.generate();

    let dir = fs.mkdirSync(token, (err) => {
        if(err) {
            return res.status(500).send(err);
        }
    });

    let config = 'wav\n'
        + req.body.bpm + '\n'
        + req.body.length + '\n'
        + req.body.repetitions + '\n'
        + req.body.factor + '\n';

    fs.writeFileSync(token+'/config', config, (err) => {
        console.log('config: '+config);
        if(err) {
            fs.rmdirSync('/'+token);
            return res.status(500).send(err);
        }
    });

    inputFile.mv(token+'/data.wav', (err) => {
        if (err) {
            fs.rmdirSync(token);
            return res.status(500).send(err);
        }
        return res.status(202).send(token);
    });

    fs.renameSync(token, processorQueuePath+token, (err) => {
        if(err) {
            fs.rmdirSync(token);
            return res.status(500).send(err);
        }
    });
});

console.log("Starting processor with " + 'bash ' 
    + processorExec + " in "
    + __dirname + processorPath);
const processor = spawn('bash',
    args=[__dirname + processorExec, __dirname + processorPath],
    { 
        cwd: __dirname + processorPath
    }
    );

processor.stdout.on('data', function (data) {
    //console.log('processor out: ' + data);
});
  
processor.stderr.on('data', function (data) {
    console.log('processor err: ' + data);
});

processor.on('exit', function (code) {
    console.log('processor exited with code ' + code);
});

app.listen(8000, () => console.log("Running on port 8000, in " + __dirname));
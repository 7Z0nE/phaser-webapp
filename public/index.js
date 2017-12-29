function submitForm() {
    var req = new XMLHttpRequest();
    let body = new FormData();
    body.append("file", document.getElementById('inputFile').files[0]);
    body.append("bpm", document.getElementById('inputBpm').value);
    body.append("length", document.getElementById('inputLength').value);
    body.append("repetitions", document.getElementById('inputRepetitions').value);
    body.append("factor", document.getElementById('inputFactor').value);
    

    req.onreadystatechange = () => {
        if(req.readyState === 4 && req.status >= 200 && req.status < 300) {
            listenToken(req.response);
        }
    };

    req.open('POST', 'http://localhost:8000/upload');
    req.send(body);

    clear();
}

function clear() {
    //nothing to clear yet
}


function listenToken(token) {
    var updater = setInterval(function() {
        var req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if(req.readyState === 4) {
                updateStatus(req);
                clearInterval(updater);
            }
        };
        req.open('GET', 'http://localhost:8000/status/'+token);
        req.send();
    } ,1000);
}

function updateStatus(req) {
    var statusBar = document.getElementById('status');
    let status = "";
    switch(req.status) {
        case 200://in queue
            status = "Processing...";
            break;
        case 404:
            status = "Something went wrong. Your task cannot be found on the server."
            break;
        case 201:
            status = "Task finished: " + req.response;
            break;
        default:
            status = "Internal server error."
            console.log(req.response);
    }
    statusBar.innerHTML = status;
}

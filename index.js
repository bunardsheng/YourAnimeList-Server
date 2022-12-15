'use strict';

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const port = 3005;

const app = express();
// uses 127.0.0.1:5500 on my laptop instead of localhost
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.use(express.json());


let completed = [];

// gets the list of completed animes
app.get('/api/completed', (req, res) => {
    res.send(completed);

});

// adds a new anime to completed
app.post('/api/completed', (req, res) => {
    const comp = req.body
  
    const compTitle = completed.find((c) => c.title === comp.title);
    if (compTitle) {
        res.status(403).send({message: "Title has already been added"});
        
    } else {
        completed.push(comp);
        fs.writeFileSync('./data/completed.json', JSON.stringify(completed))
        res.send(comp.title + ' has been added to completed')
    }
});

// updates the number of episodes
app.put('/api/completed', (req, res) => {
    const comp = req.body;
    const compTitle = completed.find((c) => c.title === comp.title);

    if (compTitle) {
        let index = completed.indexOf(compTitle)
        completed[index].seen = comp.seen
        
        fs.writeFileSync('./data/completed.json', JSON.stringify(completed));
        res.send(comp.title + ' has been updated')

    } else {
        res.status(403).send({message: "Title has already been added"});
    }
});

// deletes an anime from the list
app.delete('/api/deleted', (req, res) => {
    const comp = req.body;
    const compTitle = completed.find((c) => c.title === comp.title);

    if (compTitle) {
        let index = completed.indexOf(compTitle);
        const temp = completed.title
        completed.splice(index, 1);
        fs.writeFileSync('./data/completed.json', JSON.stringify(completed));
        res.send('Title ' + temp + ' has been deleted')
    }

    else {
        res.sendStatus(503);
    }

});

app.listen(port, () => {
    let rawData = fs.readFileSync('./data/completed.json');
    completed = JSON.parse(rawData);
    console.log('Loaded ' + completed.length + ' completed animes');
    console.log('Listening on port ' + port);
});
import { getSerialReader } from "./arduino/serialReader.js";
import db from "./db/db.js";
import { parse } from "./utils.js";
import express from 'express';
import cors from "cors"

const Arduino = getSerialReader()
Arduino.parser.on('data', data => {
    console.log('got word from arduino:', parse(data));
    db.insert({
        createdAt: new Date().getTime(),
        ...parse(data)
    })
});

const app = express();
const port = 8080;

app.use(cors())

app.get('/info', (req, res) => {
    db.find({}).sort({ createdAt: -1 }).limit(1000).exec((err, docs) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred while fetching data');
        } else {
            res.json(docs.filter( ( d, i ) => parseInt( i / 20 ) === i/20  ));
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

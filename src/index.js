import { getSerialReader } from "./arduino/serialReader.js";
import db from "./db/db.js";
import { parse } from "./utils.js";
import express from 'express';
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()
const app = express();
const port = process.env.SERVER_PORT;

let updates = 0

const fake = process.env.ENV === "development"
console.log('Running Server', 'Fake ?', fake)
let Arduino = false
const main = ( ) => {
    /** ARDUINO READ */
    let humidifier, light = true
    let humidity = 60
    let temperature = 19

    let count = 0

    if( ! fake ) {
        Arduino = getSerialReader()
        Arduino.parser.on('data', data => {
            console.log(data)
            db.insert({
                createdAt: new Date().getTime(),
                ...parse(data)
            })
        });
    } else
        setInterval( () => {
            const randHumDif = Math.floor( Math.random() * 200 ) / 100
            if( humidity > 85 )
                humidifier = false
            if( humidity < 65 )
                humidifier = true
            if( humidifier ) {
                humidity += randHumDif
                temperature -= randHumDif / 2
            } else {
                humidity -= randHumDif / 2
                temperature += randHumDif / 2
            }

            db.insert({
                createdAt: new Date().getTime(),
                temperature: temperature,
                humidity: humidity,
                humidifier,
                light
            })
            if( count === 30 )
                light = ! light
            count++
        }, 10000)

    /** APP */
    app.use(cors())

    app.get('/info', (req, res) => {
        db.find({}).sort({ createdAt: -1 }).limit(60).exec((err, docs) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error occurred while fetching data');
            } else {
                res.json(docs);
            }
        });
    });

    app.get('/action', (req,res) => {
        const { name } = req.query
        console.log(Arduino.actions, name)
        if( Arduino.actions[name] ) {
            Arduino.actions[name]()
        }
    })
    
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}
main()

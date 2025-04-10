import { getArduino } from "./src/arduino.js";
import db from "./src/db.js";
import { parse } from "./utils.js";
import express from 'express';
import cors from "cors"
import dotenv from "dotenv"
import NodeWebcam from "node-webcam";
import { WebSocketServer } from "ws"
import Canvas from "node-canvas";
import { keyInSelect } from "readline-sync";

const { createCanvas, loadImage} = Canvas
dotenv.config();

const fake = process.env.ENV === "development"

const app = express();
const port = process.env.SERVER_PORT;
const wsPort = process.env.WS_PORT;
const WSS = new WebSocketServer({ port: 30458 })

let ffmpeg = false

let lastState = {
  createdAt: 0,
  temperature: 0,
  temperatureOut: 0,
  humidity: 0,
  humidityOut: 0,
  humidifier: false,
  led: false
}

let Arduino, 
    VideoSource = false


console.log('Running Server', 'Fake ?', fake)
const main = ( ) => {
    /** ARDUINO READ */
    let humidifier, light = true
    let humidity = 60
    let temperature = 19

    let count = 0

    if( ! fake ) {
        Arduino = getArduino()
        Arduino.parser.on('data', data => {
            lastState = {
                createdAt: new Date().getTime(),
                ...parse(data)
            } 
            db.insert(lastState)
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
        }, 5000)

    /** APP */
    app.use(cors())

    app.get('/info', (req, res) => {
        db.find({}).sort({ createdAt: -1 }).limit(1000).exec((err, docs) => {
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
        console.log('Action: ', name)
        if( Arduino.actions[name] ) {
            Arduino.actions[name]()
            res.status(200).end()
        }
    })

    app.get('/stream', (req, res) => {
        VideoSource.capture( "source", function( err, data ) { 
            if( err ) {
                throw err;
            } else {
                res.status(200).send(data).end()
            }
        } );
    })
    
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

let videoOpts = {
    delay: 0,
    saveShots: false,
    callbackReturn: "base64",
    verbose: false,
    output: "jpeg",
    quality: 100
};


WSS.on('connection', ws => {
    let interval = false
    const canva = createCanvas(720, 420)
    const context = canva.getContext('2d')
    const sendCapture = (cb = false) => {
        NodeWebcam.capture( "source", videoOpts, async function( err, data ) { 
            if( err ) {
                return
                throw err;
            } else {
                const src = await loadImage(data)
                context.drawImage( src, 0, 0, 720, 420 )
                const buff = canva.toDataURL('image/jpeg', { quality: 0.7 })
                ws.send(buff)
                if( cb )
                    cb()
            }
        } )
    };
    const waitForLed = (cb = false, elseCb = () => {} ) => {
        if( lastState.led === "0") {
            Arduino.actions.ON_LED()
            const intervalLed = setInterval( () => {
                if( lastState.led === "1" ) {
                    clearInterval(intervalLed)
                    sendCapture(cb)
                } else { console.log('waiting for led') }
            }, 1000)
        } else elseCb()
    }

    waitForLed(Arduino.actions.OFF_LED, () => sendCapture())

    ws.on('message', (event) => {
        event = event.toString()
        if( event === 'START_STREAM') {
            waitForLed( () => interval = setInterval( () => sendCapture(), 2000) )
        }
        if( event === 'STOP_STREAM') {
            Arduino.actions.OFF_LED()
            clearInterval(interval)
        }

    })
    ws.on('close', () => {
        clearInterval(interval)
    })
})

NodeWebcam.list( (videoSources) => {
    if( videoSources.length ) {
        VideoSource = keyInSelect( videoSources, 'Select video source')
        VideoSource = NodeWebcam.create({
            ...videoOpts,
            device: VideoSource
        })
    }
    main()
})

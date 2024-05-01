import dotenv from "dotenv"
import {ReadlineParser, SerialPort} from 'serialport';
dotenv.config()

const SERIAL = process.env.SERIAL

export const getSerialReader = () => {
  try {
    const port = new SerialPort({ path: SERIAL, baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    port.on("open", () => {
      console.log('Serial Connection Ready');
    });
    return {
      port: port,
      parser: parser
    }
  } catch( e ) {
    console.log(e)
    return false
  } 
}

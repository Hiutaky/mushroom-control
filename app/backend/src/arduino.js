import dotenv from "dotenv"
import {ReadlineParser, SerialPort} from 'serialport';
dotenv.config()

const SERIAL = process.env.SERIAL

export const getArduino = () => {
  try {

    const port = new SerialPort({ path: SERIAL, baudRate: 9600 });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    port.on('error', e => console.log(e))
    port.on("open", () => {
      console.log('Serial Connection Ready');
    });
    const {write} = port
    const actions = {}
    const names = [
      'ON_LED',
      'OFF_LED',
      'ON_FAN',
      'OFF_FAN',
      'ON_HUM',
      'OFF_HUM',
      'ON_IO_FAN',
      'OFF_IO_FAN'
    ]
    names.map( (n) => 
      actions[n] = () => port.write(n)
    )
    return {
      port: port,
      parser: parser,
      actions
    }
  } catch( e ) {
    console.log(e)
    return false
  } 
}

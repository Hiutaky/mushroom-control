import {ReadlineParser, SerialPort} from 'serialport';

export const getSerialReader = () => {
  const port = new SerialPort({ path: '/dev/cu.usbserial-1110', baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
  port.on("open", () => {
    console.log('Serial Connection Ready');
  });
  return {
    port: port,
    parser: parser
  }
}

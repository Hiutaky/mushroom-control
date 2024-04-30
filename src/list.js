import { SerialPort } from 'serialport'

SerialPort.list().then( (list) => console.log(list))
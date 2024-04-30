import { SerialPort } from 'serialport'

export const serialList = () => SerialPort.list().then( (list) => console.log(list))
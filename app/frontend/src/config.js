console.log(process.env)
const Config = {
    host: '192.168.1.60',//`localhost` ||  window.location.hostname,
    httpPort: process.env.REACT_APP_SERVER_PORT,
    wsPort: process.env.REACT_APP_WS_PORT,
}
export const getWsHost = () => `ws://${Config.host}:${Config.wsPort}`
export const getHost = () => `http://${Config.host}:${Config.httpPort}/`

export default Config
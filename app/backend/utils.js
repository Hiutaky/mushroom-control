export const parse = (string) => {
    string = string.replace('\r', '')
    const params = string.split(',')
    let payload = {}
    params.map( (param) => {
        const [key, value] = param.split(':')
        payload[key] = value
    })
    return payload
}

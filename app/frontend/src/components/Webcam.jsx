import { useEffect, useMemo, useState } from "react"
import Button from "./Button"

const Webcam = () => {
    const [base64Frame, setFrame] = useState('')
    const [ready, setReady] = useState(false)
    const ws = useMemo( ( )=> new WebSocket('ws://localhost:3006'), [])

    const fetchWebcam = () => {
        ws.onopen = () => {
            setReady(true)
        }
        ws.onmessage = (message) => {
            setFrame(message.data)

        }
        /*const fetchFrame = async () => {
            const res = await (await fetch(`http://localhost:3001/stream`)).text()
            setFrame(res)
            setTimeout(fetchFrame, 3000)
        }
        fetchFrame()*/
    }

    useEffect( () => {
        fetchWebcam()
    }, [])

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <Button
                    disabled={!ready}
                    onClick={ () => ws.send('START_STREAM')}
                >
                    Start
                </Button>
                <Button
                    disabled={!ready}
                    onClick={ () => ws.send('STOP_STREAM')}
                >
                    Stop
                </Button>
            </div>
            <img src={base64Frame} />
        </div>
    )
}

export default Webcam

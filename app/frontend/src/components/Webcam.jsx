import { useEffect, useMemo, useState } from "react"
import Button from "./Button"
import Config, { getWsHost } from "../config"

const Webcam = () => {
    const [base64Frame, setFrame] = useState('')
    const [ready, setReady] = useState(false)
    //const ws = useMemo( ( )=> new WebSocket(getWsHost()), [])

    // const fetchWebcam = () => {
    //     /*ws.onopen = () => {
    //         setReady(true)
    //     }*/
    //     ws.onmessage = (message) => {
    //         setFrame(message.data)
    //     }
    // }

    useEffect( () => {
        //fetchWebcam()
    }, [])

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row gap-2 items-center justify-between w-full">
                <h2 className="font-semibold flex flex-row gap-2 items-center">
                    LiveStream <div className={`w-[12px] h-[12px] rounded-full ${ready ? `bg-green-500 animate-pulse` : `bg-red-500`} `}></div>
                </h2>
                <div className="flex flex-row gap-2">
                    <Button
                        disabled={!ready}
                        // onClick={ () => ws.send('START_STREAM')}
                    >
                        Start
                    </Button>
                    <Button
                        disabled={!ready}
                        // onClick={ () => ws.send('STOP_STREAM')}
                    >
                        Stop
                    </Button>
                </div>
            </div>
            <img className=" rotate-180 aspect-video bg-slate-600 rounded-lg " src={base64Frame} />
        </div>
    )
}

export default Webcam

import Button from "./Button"
import { useBackend } from "../providers/backend.provider"

const Webcam = () => {
    const { ws, image } = useBackend();


    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row gap-2 items-center justify-between w-full">
                <h2 className="font-semibold flex flex-row gap-2 items-center">
                    LiveStream <div className={`w-[12px] h-[12px] rounded-full ${ws ? `bg-green-500 animate-pulse` : `bg-red-500`} `}></div>
                </h2>
                <div className="flex flex-row gap-2">
                    <Button
                        disabled={!ws}
                        onClick={ () => ws ? ws.send('START_STREAM') : null }
                    >
                        Start
                    </Button>
                    <Button
                        disabled={!ws}
                        onClick={ () => ws ? ws.send('STOP_STREAM') : null }
                    >
                        Stop
                    </Button>
                </div>
            </div>
            <img className=" aspect-video bg-slate-600 rounded-lg " src={image} />
        </div>
    )
}

export default Webcam

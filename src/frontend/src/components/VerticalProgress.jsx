import {useMemo} from "react"
const VerticalProgress = ({
    label = `Temperature`,
    unit = `C`,
    width = 32,
    value = 40,
    min = 0,
    max = 60,
    color = "bg-red-700"
}) => {

    const perc = useMemo( () => {
        return 100 / max * value
    }, [value])

    return (
        <div className="flex flex-col gap-3">
            <span className="text-sm font-bold">{label}</span>
            <div className="relative h-full">
                <div className="min absolute bottom-0 border-b-2 w-full text-right">
                    {min}{unit}
                </div>
                <div className="max absolute top-0 start-0 border-t-2 w-full text-right">
                    {max}{unit}
                </div>
                <div className="value absolute start-0 w-full border-t-2 text-right" style={{ top: `${100-perc}%`}}>
                    {value}{unit}
                </div>
                <div 
                    className={`flex flex-col justify-end h-full bg-gray-500`}
                    style={{
                        width: `${width}px`
                    }}
                >
                    <div className={` bg-danger w-full ${color} `}
                        style={{
                            height: `${perc}%`
                        }}
                    >
                    </div>
                </div>
            </div>
        </div>
    )
}
export default VerticalProgress;
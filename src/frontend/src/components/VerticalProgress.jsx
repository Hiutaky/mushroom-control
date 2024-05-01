import {useMemo} from "react"
const VerticalProgress = ({
    label = `Temperature`,
    unit = `C`,
    width = 28,
    value = 40,
    min = 0,
    max = 60,
    color = "bg-red-700"
}) => {

    const perc = useMemo( () => {
        let _max = min >= 0 ? max : max + Math.abs(min)
        let _value = min >= 0 ? value : value + Math.abs(min)
        return 100 / _max * _value
    }, [value])

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-600">{label}</span>
            <div className="relative h-full bg-gray-100 rounded-lg p-2 text-xs font-semibold">
                <div className="relative h-full">
                    <div className={` max absolute bottom-0 start-0  w-full ${ perc > 5 ? `text-right` : `text-white`} `}>
                        {min}{unit}
                    </div>
                    <div className={` max absolute top-0 start-0  w-full ${ perc < 95 ? `text-right` : `text-white`} `}>
                        {max}{unit}
                    </div>
                    <div className={` value absolute start-0 w-full  text-right transition-all duration-500`} style={{ top: `${100-perc}%`}}>
                        <span className={` absolute end-0 top-0 ${perc <= 5 ? `mt-[-20px]` : `` }`}>{parseFloat(value).toFixed(2)}{unit}</span>
                    </div>
                    <div 
                        className={`flex flex-col justify-end h-full bg-gray-500 rounded-lg`}
                        style={{
                            width: `${width}px`
                        }}
                    >
                        <div className={`rounded-lg bg-danger w-full ${color} transition-all duration-500`}
                            style={{
                                height: `${perc}%`
                            }}
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default VerticalProgress;
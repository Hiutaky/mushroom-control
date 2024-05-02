import { useState } from "react"

const Sensor = ({
    active = true,
    className = ``,
    icon = ``,
    label = ``,
    loading = false,
    onClick,
}) => {
    return (
        <button 
            onClick={ onClick }
            className={`${loading ? `animate-pulse` : `` } flex text-white flex-col items-center gap-1 p-2 rounded ${className} ${active ? `bg-green-600` : `bg-gray-600`}`}
            disabled={loading}
        >
            <img src={icon} alt={label} width={24} height={24}/>
            <span className=" text-xs font-bold">{label}</span>
        </button>
    )
}
export default Sensor
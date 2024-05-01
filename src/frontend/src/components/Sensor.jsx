const Sensor = ({
    className = ``,
    icon = ``,
    label = ``,
    active = true
}) => {
    return (
        <div className={`flex text-white flex-col items-center gap-1 p-2 rounded ${className} ${active ? `bg-green-600` : `bg-gray-600`}`}>
            <img src={icon} alt={label} width={24} height={24}/>
            <span className=" text-xs font-bold">{label}</span>
        </div>
    )
}
export default Sensor
import icons from "../icons/icons.js"
import { useBackend } from "../providers/backend.provider.tsx"

const Header = ({
    theme,
    toggleTheme
}) => {
    const { lastUpdate } = useBackend()
    return (
        <div className=" px-2 md:px-0 w-full flex flex-col items-center mb-2">
            <div className="container flex flex-row gap-3 items-start justify-between py-3">
                <h3 className="font-bold text-lg flex flex-row items-center gap-2">
                    <img src={icons.Mushroom} width={32} height={32} />
                    MushFarm
                </h3>
                <div className="flex flex-col gap-1">
                    <div 
                        className="switcher p-2 bg-gray-100 w-[calc(0.5em*2+18px*2)] dark:bg-slate-800 rounded-full cursor-pointer"
                        onClick={ () => toggleTheme() }
                    >
                        <div className={`transition-all ${ theme === 'dark' ? `translate-x-[18px] bg-blue-500` : `bg-blue-500`} w-[18px] h-[18px] rounded-full`}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
import { useStats } from "../providers/stats.provider.tsx"

const Header = () => {
    const { lastUpdate } = useStats()
    return (
        <div className="w-full flex flex-col items-center border-b-2 mb-2">
            <div className="container flex flex-row gap-3 items-start justify-between py-3">
                <h3 className="font-bold text-lg">MushFarm</h3>
                <div className="flex flex-col gap-1">
                    <span className="text-sm">Last update: { new Date(lastUpdate).toLocaleString() }</span>
                </div>
            </div>
        </div>
    )
}

export default Header
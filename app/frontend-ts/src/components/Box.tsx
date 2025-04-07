import { ReactNode } from "react";

type Props = {
    className?: string;
    direction?: 'row' | 'col',
    children: ReactNode
}

const Box = ({
    className = ``,
    direction = 'row',
    children
} : Props ) => {
    return (
        <div className={`${className} flex flex-${direction} gap-3 p-3 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-100`}>
            {children}
        </div>
    )
}

export default Box
import { ReactNode } from "react"

type Props = {
    children: ReactNode | string
    disabled?: boolean
    onClick?: () => void
}
const Button = ({
    children,
    disabled = false,
    onClick = () => {}
} : Props ) => {
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className="px-4 py-1 font-semibold bg-blue-500 text-white rounded-lg"
        >
            {children}
        </button>
    )
}

export default Button
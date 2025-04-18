interface CustomButtonProps {
    label: string;
    className?: string;
    onClick: () => void;
    disabled?: boolean; // ← добавь это
}

const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    className,
    onClick,
    disabled
    
}) => {
    return (
        <div 
            onClick={onClick}
            className={`w-full py-2 bg-black hover:bg-dark text-white text-center rounded-xl transition cursor-pointer ${className}`}
        >
            disabled={disabled}
            {label}
        </div>
    )
}

export default CustomButton;
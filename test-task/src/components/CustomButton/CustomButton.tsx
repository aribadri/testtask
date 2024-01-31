import React from 'react';


interface CustomButtonProps {
    onSubmit: () => void;
    className?: string;
    children: React.ReactNode
}

const CustomButton: React.FC<CustomButtonProps> = ({ onSubmit, className, children }) => {
    return (
        <>
            <button className={className} onClick={onSubmit}>{children}</button>
        </>
    );
};

export default CustomButton;

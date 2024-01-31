import React from 'react';

interface ColorInputProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    placeholder: string;

}

const ColorInput: React.FC<ColorInputProps> = ({ placeholder, value, onChange }) => {

  
    return (
        <>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder = {placeholder}
            />
        </>

    );
};

export default ColorInput;

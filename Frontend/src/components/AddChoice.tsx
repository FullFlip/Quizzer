import React, { useState } from 'react'

const AddChoice = () => {

    const [choice, setChoice] = useState({
        answer: "",
        isCorrect: false
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setChoice((prevChoice) => ({
            ...prevChoice,
            isCorrect: !prevChoice.isCorrect, 
        }));    
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChoice({ ...choice, answer: event.target.value });
    }

    return (
        <div className='w-full border p-2 rounded flex justify-between gap-2'>
            <input
                type='text'
                placeholder='Answer'
                name="answer"
                onChange={handleChange}
                className="font-medium font-sans text-black placeholder:text-black/50 bg-transparent border-b text-2xl w-5/6 shadow-xl p-2 rounded"
            />
            <button className={`w-1/6 rounded-xl
                ${choice.isCorrect ? "bg-emerald-400" : "bg-red-400"}`}
                onClick={handleClick}>
                {choice.isCorrect ? "true" : "false"}
            </button>
        </div >
    )
}

export default AddChoice;
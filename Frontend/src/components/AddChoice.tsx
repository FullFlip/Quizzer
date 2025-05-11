import React from "react";
import { AddChoiceProps } from "../Types";

const AddChoice: React.FC<AddChoiceProps> = ({ choice, onChange, onToggleCorrect, onDelete }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(choice.id, event.target.value);
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onToggleCorrect(choice.id);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onDelete(choice.id);
    };

    return (
        <div className="w-full border p-2 rounded flex justify-between gap-2 items-center">
            <input
                type="text"
                placeholder="Answer"
                name="answer"
                value={choice.answer}
                onChange={handleInputChange}
                className="font-medium font-sans text-black placeholder:text-black/50 bg-transparent border-b text-2xl w-4/6 shadow-xl p-2 rounded"
            />
            <button
                className={`w-1/6 rounded-xl p-2 ${
                    choice.isCorrect ? "bg-emerald-400" : "bg-red-400"
                }`}
                onClick={handleButtonClick}
            >
                {choice.isCorrect ? "true" : "false"}
            </button>
            <button
                className="w-1/6 p-2 bg-red-600 text-white rounded-xl"
                onClick={handleDeleteClick}
            >
                Delete
            </button>
        </div>
    );
};

export default AddChoice;
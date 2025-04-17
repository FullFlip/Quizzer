import React from "react";

type AddChoiceProps = {
    choice: {
        id: number;
        answer: string;
        isCorrect: boolean;
    };
    onChange: (id: number, value: string) => void;
    onToggleCorrect: (id: number) => void;
};

const AddChoice: React.FC<AddChoiceProps> = ({ choice, onChange, onToggleCorrect }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(choice.id, event.target.value);
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onToggleCorrect(choice.id);
    };

    return (
        <div className="w-full border p-2 rounded flex justify-between gap-2">
            <input
                type="text"
                placeholder="Answer"
                name="answer"
                value={choice.answer}
                onChange={handleInputChange}
                className="font-medium font-sans text-black placeholder:text-black/50 bg-transparent border-b text-2xl w-5/6 shadow-xl p-2 rounded"
            />
            <button
                className={`w-1/6 rounded-xl ${
                    choice.isCorrect ? "bg-emerald-400" : "bg-red-400"
                }`}
                onClick={handleButtonClick}
            >
                {choice.isCorrect ? "true" : "false"}
            </button>
        </div>
    );
};

export default AddChoice;
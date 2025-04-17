import { useState } from "react";
import AddChoice from "./AddChoice";

type AddQuestionProps = {
    handleAddQuestionClick: (shouldClose: boolean) => void;
};

const AddQuestion = ({ handleAddQuestionClick }: AddQuestionProps) => {
    const [questionData, setQuestionData] = useState("");
    const [choices, setChoices] = useState<string[]>(["", ""]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionData(event.target.value);
    }

    const [choiceCounter, setChoiceCounter] = useState(2);

    const addNewChoice = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (choiceCounter < 4) {
            setChoiceCounter(choiceCounter + 1)
            setChoices([...choices, ""]);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800/90 flex justify-center items-center">
            <div className="w-4/6 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Add a New Question</h2>
                {/* Add form or content for adding a question here */}

                <form className="h-fit w-full py-4">
                    <input
                        type='text'
                        placeholder='Title'
                        name="title"
                        value={questionData}
                        onChange={handleChange}
                        className="my-3 font-medium font-sans text-black placeholder:text-black/50
                         bg-transparent border text-2xl w-full shadow-xl p-2 rounded"
                    />
                    <div className="w-full flex justify-between py-2">
                        <h3 className="font-semibold text-xl mb-2">Choices</h3>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            onClick={addNewChoice}>Add new choice
                        </button>
                    </div>

                    {choices.map((index) => (
                        <div key={index}>
                            <AddChoice />
                        </div>
                    ))}

                </form>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => handleAddQuestionClick(false)}
                >
                    Close
                </button>

            </div>
        </div>
    )
}

export default AddQuestion;
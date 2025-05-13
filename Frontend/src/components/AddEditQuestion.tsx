import { useEffect, useState } from "react";
import { QuestionProps } from "../Types";
import AddChoice from "./AddChoice";

// Updated interface and removed unused variable
interface ExtendedQuestionProps {
    quizId: string;
    handleAddQuestionClick: (isOpen: boolean) => void;
    onQuestionSaved: () => void;
    questionToEdit?: QuestionProps;
}

const AddEditQuestion = ({ handleAddQuestionClick, quizId, questionToEdit, onQuestionSaved }: ExtendedQuestionProps) => {
    const [questionData, setQuestionData] = useState({
        quiz: {
            id: quizId,
        },
        title: questionToEdit?.title || "",
        difficulty: questionToEdit?.difficulty || "",
        choices: questionToEdit?.choices || [],
    });

    const [choices, setChoices] = useState<{ id: number; answer: string; isCorrect: boolean }[]>(
        questionToEdit
            ? questionToEdit.choices.map((choice) => ({
                id: choice.choiceId,
                answer: choice.description,
                isCorrect: choice.true,
            }))
            : [
                { id: 1, answer: "", isCorrect: false },
                { id: 2, answer: "", isCorrect: false },
            ]
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionData({ ...questionData, title: event.target.value });
    };

    const addNewChoice = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (choices.length < 4) {
            const newChoice = {
                id: choices.length + 1,
                answer: "",
                isCorrect: false,
            };
            setChoices([...choices, newChoice]);
        }
    };

    const handleChoiceChange = (id: number, value: string) => {
        const updatedChoices = choices.map((choice) =>
            choice.id === id ? { ...choice, answer: value } : choice
        );
        setChoices(updatedChoices);
    };

    const toggleIsCorrect = (id: number) => {
        const updatedChoices = choices.map((choice) => {
            // If this is the choice being clicked
            if (choice.id === id) {
                // Toggle it on (if it was false) or do nothing if it's already true
                // This prevents having no correct answer at all
                return { ...choice, isCorrect: true };
            } else {
                // All other choices must be set to false
                return { ...choice, isCorrect: false };
            }
        });
        setChoices(updatedChoices);
    };

    const handleDeleteChoice = (id: number) => {
        setChoices((prevChoices) => prevChoices.filter((choice) => choice.id !== id));
    };

    useEffect(() => {
        setQuestionData((prevData) => ({
            ...prevData,
            choices: choices.map((choice) => ({
                choiceId: choice.id,
                description: choice.answer,
                true: choice.isCorrect,
            })),
        }));
    }, [choices]);

    const saveQuestion = () => {
        if (!questionData.title.trim()) {
            window.alert("The question title cannot be empty.");
            return;
        }

        // Validation for choices
        if (choices.length < 2) {
            window.alert("A question must have at least 2 choices.");
            return;
        }

        for (const choice of choices) {
            if (!choice.answer.trim()) {
                window.alert("All choices must have a description.");
                return;
            }
        }

        const hasCorrectChoice = choices.some((choice) => choice.isCorrect);
        if (!hasCorrectChoice) {
            window.alert("At least one choice must be marked as correct.");
            return;
        }
        const correctChoiceCount = choices.filter(choice => choice.isCorrect).length;
        if (correctChoiceCount !== 1) {
            window.alert("Exactly one choice must be marked as correct.");
            return;
        }



        const url = questionToEdit
            ? `/question/${questionToEdit.id}`
            : "/questions-with-choices";

        const method = questionToEdit ? "PUT" : "POST";
        const alertMessage = questionToEdit ? "Question modified successfully" : "Question added successfully";
        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(quizId && { quizId }),
            },
            body: JSON.stringify(questionData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Use text() so parsing is safe even if body is empty.
                return response.text();
            })
            .then(() => {
                window.alert(alertMessage);
                onQuestionSaved(); // trigger data update in parent component
                handleAddQuestionClick(false);
            })
            .catch((error) => {
                console.error('Error saving question:', error);
            });
    };

    return (
        <div className="fixed inset-0 bg-gray-800/90 flex justify-center items-center">
            <div className="w-4/6 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                    {questionToEdit ? "Edit Question" : "Add a New Question"}
                </h2>

                <form className="h-fit w-full py-4">
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={questionData.title}
                        onChange={handleChange}
                        className="my-3 font-medium font-sans text-black placeholder:text-black/50
                        bg-transparent border text-xl w-full shadow-xl p-2 rounded"
                    />

                    <div className="my-4">
                        <label htmlFor="difficulty" className="block text-lg font-semibold mb-2">
                            Difficulty
                        </label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={questionData.difficulty}
                            onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
                            className="w-full p-2 border rounded shadow-sm text-black"
                        >
                            <option value="" disabled>
                                Select difficulty
                            </option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className="w-full flex justify-between py-2">
                        <h3 className="font-semibold text-xl mb-2">Choices</h3>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            onClick={addNewChoice}
                        >
                            Add new choice
                        </button>
                    </div>

                    {choices.map((choice) => (
                        <AddChoice
                            key={choice.id}
                            choice={choice}
                            onChange={handleChoiceChange}
                            onToggleCorrect={toggleIsCorrect}
                            onDelete={handleDeleteChoice}
                        />
                    ))}
                </form>
                <div className="flex justify-between">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        onClick={() => handleAddQuestionClick(false)}
                    >
                        Close
                    </button>

                    <button
                        className="bg-emerald-400 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                        onClick={saveQuestion}
                    >
                        {questionToEdit ? "Save Changes" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditQuestion;
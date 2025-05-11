import { useEffect, useState } from "react";
import { QuestionProps } from "../Types";
import AddChoice from "./AddChoice";

const AddEditQuestion = ({ handleAddQuestionClick, quizId, questionToEdit }: QuestionProps) => {
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

    const apiUrl = import.meta.env.VITE_API_URL || "";

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
        console.log(id);

        const updatedChoices = choices.map((choice) =>
            choice.id === id ? { ...choice, isCorrect: !choice.isCorrect } : choice
        );
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
        console.log(questionData);

        const url = questionToEdit
            ? `http://localhost:8080/question/${questionToEdit.id}`
            : "http://localhost:8080/questions-with-choices";

        const method = questionToEdit ? "PUT" : "POST";
        const alertMessage = questionToEdit ? "Question modified successfully" : "Question added successfully"
        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(quizId && { quizId }),
            },
            body: JSON.stringify(questionData),
        })
            .then((response) => {
                if (response.ok) {
                    console.log(response);
                    window.alert(alertMessage)
                }
            })
            .then(() => window.location.reload());
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
                        onClick={() => handleAddQuestionClick?.(false)}
                    >
                        Close
                    </button>

                    <button
                        className="bg-emerald-400 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                        onClick={() => {
                            saveQuestion();
                        }}
                    >
                        {questionToEdit ? "Save Changes" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditQuestion;
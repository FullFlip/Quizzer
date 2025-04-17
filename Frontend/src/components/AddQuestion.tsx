import { useEffect, useState } from "react";
import AddChoice from "./AddChoice";

type AddQuestionProps = {
    quizId: string | undefined;
    handleAddQuestionClick: (shouldClose: boolean) => void;
};

const AddQuestion = ({ handleAddQuestionClick, quizId }: AddQuestionProps) => {
    const [questionData, setQuestionData] = useState({
        quiz: {
            id: quizId,
        },
        title: "",
        difficulty: "hard",
        choices: Array<{
            id: number;
            description: string;
            true: boolean;
        }>(),
    });

    const [choices, setChoices] = useState<{ id: number; answer: string; isCorrect: boolean }[]>([
        { id: 1, answer: "", isCorrect: false },
        { id: 2, answer: "", isCorrect: false },
    ]);

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
        const updatedChoices = choices.map((choice) =>
            choice.id === id ? { ...choice, isCorrect: !choice.isCorrect } : choice
        );
        setChoices(updatedChoices);
    };

    useEffect(() => {
        setQuestionData((prevData) => ({
            ...prevData,
            choices: choices.map((choice) => ({
                id: choice.id,
                description: choice.answer,
                true: choice.isCorrect,
            })),
        }));
    }, [choices]);

    const addNewQuestion = () => {
        console.log(questionData);


        fetch("http://localhost:8080/questions-with-choices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(quizId && { quizId }),
            },
            body: JSON.stringify(questionData),
        })
            .then((response) => {
                console.log(response);

                return response.json()
            }
            )
            .then((data) => console.log(data));

    };

    return (
        <div className="fixed inset-0 bg-gray-800/90 flex justify-center items-center">
            <div className="w-4/6 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Add a New Question</h2>

                <form className="h-fit w-full py-4">
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={questionData.title}
                        onChange={handleChange}
                        className="my-3 font-medium font-sans text-black placeholder:text-black/50
                         bg-transparent border text-2xl w-full shadow-xl p-2 rounded"
                    />
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
                        onClick={() => {
                            addNewQuestion();
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddQuestion;
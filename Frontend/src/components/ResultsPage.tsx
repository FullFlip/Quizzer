import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Question } from "../Types";

const ResultsPage = () => {
    const { quizId } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);

    const fetchData = () => {
        fetch(`http://localhost:8080/quizzes/${quizId}/only-questions`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setQuestions(data);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">
                Results for Quiz ID: {quizId}
            </h1>
            <ul className="space-y-8">
                {questions.map((question) => (
                    <li
                        key={question.id}
                        className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
                    >
                        <h2 className="text-xl font-semibold text-blue-700 mb-2">
                            {question.title}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Difficulty: <span className="font-medium">{question.difficulty}</span>
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                                {question.answers?.map((answer) => {
                                    const totalAttempts = answer.correctAnswers + answer.wrongAnswers;
                                    const ratio =
                                        totalAttempts > 0
                                        ? ((answer.correctAnswers / totalAttempts) * 100).toFixed(0)
                                        : "No attempts";

                                    return (
                                        <li
                                            key={answer.id}
                                            className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                                        >
                                            <div className="text-sm text-gray-600">
                                                <p>Correct answers: {ratio}% </p>
                                                <p>Correct answers: {answer.correctAnswers}</p>
                                                <p>Wrong answers: {answer.wrongAnswers}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResultsPage;
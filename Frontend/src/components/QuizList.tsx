import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

type QuizTypes = {
    id: number;
    title: string;
    description: string;
    courseCode: string;
    publishedStatus: boolean;
    publishedDate: string;
}

const QuizList = () => {

    const [data, setData] = useState<QuizTypes[]>([]);
    const navigate = useNavigate();
    const fetchData = () => {
        fetch("http://localhost:8080/quizzes/1", {
            method: "GET",
        })
            .then((response) => {
                console.log(response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setData(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuizClick = (quizId: number) => {
        console.log(quizId);
        
        navigate(`/quiz/${quizId}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6" >
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Quizzes</h1>
                <div className="grid grid-cols-1 gap-6">
                    {data.map((quiz) => (
                        <div
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500/90 text-white hover:cursor-pointer p-6 rounded-lg shadow-md"
                            key={quiz.id}
                            onClick={() => handleQuizClick(quiz.id)}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">{quiz.title}</h2>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${quiz.publishedStatus
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                        }`}
                                >
                                    {quiz.publishedStatus ? "Published" : "Not Published"}
                                </span>
                            </div>
                            <p className="text-lg mb-2">{quiz.description}</p>
                            <div className="flex justify-between items-center text-sm">
                                <p className="font-medium">Course Code: {quiz.courseCode}</p>
                                <p className="font-medium">Added On: {quiz.publishedDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default QuizList;
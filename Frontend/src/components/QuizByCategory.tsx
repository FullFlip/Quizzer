import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizTypes } from '../Types';
import QuizCard from './QuizCard';

const QuizByCategory = () => {
    const { category } = useParams<{ category: string }>();
    const [quizzes, setQuizzes] = useState<QuizTypes[]>([]);
    const navigate = useNavigate();


    const fetchQuizzesByCategory = () => {
        fetch(`/quizzes/categories/${category}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);

                setQuizzes(data);
            })
            .catch((error) => {
                console.error("Error fetching published quizzes:", error);
            });
    };

    const handleQuizClick = (quizId: number | undefined) => {
        navigate(`/student/quiz/${quizId}`);
      };

    useEffect(() => {
        fetchQuizzesByCategory();
    }, []);

    return (
        <div className="flex flex-col p-4 min-h-screen bg-gray-100">
            <div className="flex items-center mb-6">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-4"
                    onClick={() => navigate('/student?tab=categories')}
                >
                    Return to Categories
                </button>
                <h1 className="text-3xl font-bold">Quizzes in Category: {category}</h1>
            </div>
            <QuizCard quizzes={quizzes} handleQuizClick={handleQuizClick} />
        </div>
    );
};

export default QuizByCategory;
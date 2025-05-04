import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizTypes } from '../Types';
import QuizCard from './QuizCard';

const QuizByCategory = () => {
    const { category } = useParams<{ category: string }>();
    const [quizzes, setQuizzes] = useState<QuizTypes[]>([]);
    const navigate = useNavigate();


    const fetchQuizzesByCategory = () => {
        fetch(`http://localhost:8080/quizzes/categories/${category}`, {
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
            <h1 className="text-3xl font-bold mb-6">Quizzes in Category: {category}</h1>
            <QuizCard quizzes={quizzes} handleQuizClick={handleQuizClick} />
        </div>
    );
};

export default QuizByCategory;
import React, { useEffect, useState } from 'react'

type QuizTypes = {
    quizId: number;
    title: string;
    description: string;
    courseCode: string;
    publishedStatus: boolean;
    publishedDate: string;
    questions: {
        id: number;
        title: string;
        difficulty: string;
    }[];
}

const QuizList = () => {

    const [data, setData] = useState<QuizTypes[]>([]);


    const fetchData = () => {

        fetch("http://localhost:8080/quizzes/2")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                
                setData(data)
            }
        );

    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div>
        {data.map((quiz) => (
            <li className='bg-amber-300 flex flex-col gap-4 p-3 my-3 rounded-4xl w-[30rem] h-[20rem] lg:w-[40rem] m-auto' key={quiz.quizId}>
                <p className='text-4xl font'>{quiz.title}</p>
                <p>{quiz.description}</p>
                <p className='font-mono text-emerald-500 not-hover:text-blue-600 hover:text-7xl'>{quiz.courseCode}</p>
                <p>{quiz.publishedDate}</p>
                <div>
                    {quiz.publishedStatus ? (
                        <span>Published status is true</span>
                    ) : (
                        <span>Published status is false</span>
                    )}
                </div>

                {quiz.questions && quiz.questions.length > 0 ? (
                    quiz.questions.map((question) => (
                        <div 
                        className="bg-gradient-to-t from-fuchsia-700 to-40% to-amber-800 p-2 rounded-lg shadow-md"
                        key={question.id}>
                            <p>{question.title}</p>
                            <p>{question.difficulty}</p>
                        </div>
                    ))
                ) : (
                    <p>No questions available for this quiz.</p>
                )}
            </li>
        ))}
    </div>
    )
}

export default QuizList;
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
            <div className='w-full p-4 m-2 mx-4 '>
                <h1 className='text-4xl '>Quizzes</h1>
                <div className='flex justify-between'>
                    <div className='flex mt-4 gap-2'>
                        <h2 className='w-[10rem] font-semibold'>Name</h2>
                        <h2 className='font-semibold'>Description</h2>
                    </div>
                    <div className='flex mt-4 gap-8 w-[21rem]'>
                        <h2 className='font-semibold'>Course</h2>
                        <h2 className='font-semibold'>Published</h2>
                        <h2 className='font-semibold'>Added on</h2>
                    </div>
                </div>
                {data.map((quiz) => (
                    <li className='flex justify-between items-center gap-4 p-3 my-3 m-auto shadow-2xl border-b-2 border-slate-500/40' key={quiz.quizId}>
                        <div className='flex justify-between'>
                            <p className='w-[10rem]'>{quiz.title}</p>
                            <p className='w-[20rem]'>{quiz.description}</p>
                        </div>
                        <div className='flex justify-stretch items-center w-[20rem] gap-8'>
                            <p className=''>{quiz.courseCode}</p>
                            <div className='w-[7rem]'>
                                {quiz.publishedStatus ? (
                                    <p className='p-1 text-white font-semibold text-sm bg-blue-400 rounded-xl'>Published</p>
                                ) : (
                                    <p className='p-1 text-white font-semibold text-sm bg-slate-500 rounded-xl'>Not published</p>
                                )}
                            </div>
                            <p className=''>{quiz.publishedDate}</p>
                            <div>

                            </div>
                        </div>
                    </li>
                ))}
            </div>
        </div>
    )
}

export default QuizList;
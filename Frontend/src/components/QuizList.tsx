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
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: "",
        description: "",
        courseCode: ""
    });
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

    const handleDelete = (quizId: number) => {
        fetch(`http://localhost:8080/quizzes/${quizId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setData((prevData) => prevData.filter((quiz) => quiz.id !== quizId));
            })
            .catch((error) => {
                console.error("Error deleting quiz:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuizClick = (quizId: number) => {
        console.log(quizId);
        
        navigate(`/quiz/${quizId}`);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQuiz({
            ...newQuiz,
            [name]: value
        });
    };

    const handleAddQuizSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newQuiz.title || !newQuiz.description || !newQuiz.courseCode) {
            alert("Please fill out all fields");
            return;
        }
        
        const quizToAdd = {
            title: newQuiz.title,
            description: newQuiz.description,
            courseCode: newQuiz.courseCode,
            publishedStatus: false,
            publishedDate: new Date().toISOString().split('T')[0],
            teacher: { teacherId: 1 } 
        };
    
        fetch("http://localhost:8080/quizzes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(quizToAdd),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((createdQuiz) => {
                console.log("Quiz created:", createdQuiz);
                setData([...data, createdQuiz]);
                setNewQuiz({
                    title: "",
                    description: "",
                    courseCode: ""
                });
                setShowAddForm(false);
            })
            .catch((error) => {
                console.error("Error creating quiz:", error);
            });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6" >
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Quizzes</h1>
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                    >
                        {showAddForm ? 'Cancel' : 'Add Quiz'}
                    </button>
                </div>
                
                {showAddForm && (
                    <div className="bg-gray-50 p-4 rounded-lg shadow mb-6">
                        <form onSubmit={handleAddQuizSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newQuiz.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter quiz title"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newQuiz.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter quiz description"
                                />
                            </div>
                            <div>
                                <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Course Code
                                </label>
                                <input
                                    type="text"
                                    id="courseCode"
                                    name="courseCode"
                                    value={newQuiz.courseCode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter course code"
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                                >
                                    Save Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
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
                            <div className="flex justify-between items-center text-sm mb-4">
                                <p className="font-medium">Course Code: {quiz.courseCode}</p>
                                <p className="font-medium">Added On: {quiz.publishedDate}</p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete the quiz "${quiz.title}"?`)) {
                                            handleDelete(quiz.id);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizList;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddQuiz from './AddQuiz';
import Categories from './Categories';

type QuizTypes = {
    id: number;
    title: string;
    description: string;
    courseCode: string;
    publishedStatus: boolean;
    publishedDate: string;
    category?: {
        categoryId: number;
        title: string;
        description?: string;
    };
    categoryId?: number;
};

const QuizList = () => {
    const [data, setData] = useState<QuizTypes[]>([]);
    const [filteredData, setFilteredData] = useState<QuizTypes[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'quizzes' | 'categories'>('quizzes');
    const navigate = useNavigate();

    const fetchData = () => {
        fetch("http://localhost:8080/quizzes", {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
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

    useEffect(() => {
        if (selectedCategoryId === null) {
            setFilteredData(data);
        } else {
            setFilteredData(data.filter((quiz) => quiz.categoryId === selectedCategoryId));
        }
    }, [data, selectedCategoryId]);

    const handleQuizClick = (quizId: number) => {
        navigate(`/quiz/${quizId}`);
    };

    const handleAddQuiz = (quizToAdd: {
        title: string;
        description: string;
        courseCode: string;
        publishedStatus: boolean;
        publishedDate: string;
        categoryId: number;
        teacher: { teacherId: number };
    }) => {
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
                setData([...data, createdQuiz]);
                setShowAddForm(false);
            })
            .catch((error) => {
                console.error("Error creating quiz:", error);
            });
    };


    const handleCategorySelect = (categoryId: number | null) => {
        const quizzesInCategory = data.filter((quiz) => quiz.categoryId === categoryId);

        if (categoryId !== null && quizzesInCategory.length === 0) {
            alert("No quizzes found in the selected category.");
            return;
        }

        setSelectedCategoryId(categoryId);
        setActiveTab('quizzes');
    };

    const selectedCategoryTitle = selectedCategoryId
    ? `Quizzes in category: ${data.find((quiz) => quiz.categoryId === selectedCategoryId)?.category?.title || "Unknown"}`
    : "All Quizzes";

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Teacher view</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/student')}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                        >
                            Student View
                        </button>
                    </div>
                </div>

                {/* Tab Selection */}
                <div className="w-full flex justify-center mb-6">
                    <button
                        className={`p-2 mx-2 text-white font-medium rounded-lg ${activeTab === 'quizzes' ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                        onClick={() => setActiveTab('quizzes')}
                    >
                        Quizzes
                    </button>
                    <button
                        className={`p-2 mx-2 text-white font-medium rounded-lg ${activeTab === 'categories' ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Categories
                    </button>
                </div>

                {/* Conditional Rendering Based on Active Tab */}
                {activeTab === 'quizzes' && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            {selectedCategoryTitle}
                        </h2>
                        {showAddForm && (
                            <div className="bg-gray-50 p-4 rounded-lg shadow mb-6">
                                <AddQuiz
                                    onAddQuiz={handleAddQuiz}
                                    onCancel={() => setShowAddForm(false)}
                                    showFormControls={false}
                                />
                            </div>
                        )}
                        <AddQuiz onAddQuiz={handleAddQuiz} />
                        <div className="grid grid-cols-1 gap-6">
                            {filteredData.map((quiz) => (
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
                                        <div>
                                            <p className="font-medium">Course Code: {quiz.courseCode}</p>
                                            {quiz.category && (
                                                <p className="font-medium mt-1">Category: {quiz.category.title}</p>
                                            )}
                                        </div>
                                        <p className="font-medium">Added On: {quiz.publishedDate}</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                                            onClick={(event) => {
                                                event.stopPropagation();
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
                    </>
                )}

                {activeTab === 'categories' && (

                    <Categories onCategorySelect={handleCategorySelect} selectedCategoryId={selectedCategoryId} />
                )}
            </div>
        </div>
    );
};

export default QuizList;
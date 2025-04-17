import React, { useState } from 'react';

type QuizFormData = {
    title: string;
    description: string;
    courseCode: string;
}

type AddQuizProps = {
    onAddQuiz: (quiz: {
        title: string;
        description: string;
        courseCode: string;
        publishedStatus: boolean;
        publishedDate: string;
        teacher: { teacherId: number }
    }) => void;
}

const AddQuiz: React.FC<AddQuizProps> = ({ onAddQuiz }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuiz, setNewQuiz] = useState<QuizFormData>({
        title: "",
        description: "",
        courseCode: ""
    });

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
    
        onAddQuiz(quizToAdd);
        
        setNewQuiz({
            title: "",
            description: "",
            courseCode: ""
        });
        setShowAddForm(false);
    };

    return (
        <div>
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
        </div>
    );
};

export default AddQuiz;
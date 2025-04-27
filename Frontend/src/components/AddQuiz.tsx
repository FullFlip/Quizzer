import React, { useState } from 'react';
import { QuizFormData, AddQuizProps } from "../Types";

const AddQuiz: React.FC<AddQuizProps> = ({ onAddQuiz, onCancel, showFormControls = true }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuiz, setNewQuiz] = useState<QuizFormData>({
        title: "",
        description: "",
        courseCode: "",
        publishedStatus: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQuiz({
            ...newQuiz,
            [name]: value
        });
    };

    const handleToggleChange = () => {
        setNewQuiz({
            ...newQuiz,
            publishedStatus: !newQuiz.publishedStatus
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
            publishedStatus: newQuiz.publishedStatus,
            publishedDate: new Date().toISOString().split('T')[0],
            teacher: { teacherId: 1 } 
        };
    
        onAddQuiz(quizToAdd);
        
        setNewQuiz({
            title: "",
            description: "",
            courseCode: "",
            publishedStatus: false
        });
        
        if (showFormControls) {
            setShowAddForm(false);
        }
    };

    // Only show the form when:
    // 1. This component is not externally controlled (showFormControls=true) AND user clicked the button (showAddForm=true)
    // OR
    // 2. This component is externally controlled (showFormControls=false)
    const shouldShowForm = (showFormControls && showAddForm) || !showFormControls;

    return (
        <div>
            {showFormControls && (
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Quizzes</h1>
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                    >
                        {showAddForm ? 'Cancel' : 'Add Quiz'}
                    </button>
                </div>
            )}
            
            {shouldShowForm && (
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
                    <div className="flex items-center">
                        <label htmlFor="publishedStatus" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="publishedStatus"
                                    className="sr-only"
                                    checked={newQuiz.publishedStatus}
                                    onChange={handleToggleChange}
                                />
                                <div className={`block w-14 h-8 rounded-full ${newQuiz.publishedStatus ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${newQuiz.publishedStatus ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                            <span className="ml-3 font-medium text-gray-700">
                                {newQuiz.publishedStatus ? 'Published' : 'Not Published'}
                            </span>
                        </label>
                    </div>
                    <div className="flex justify-end pt-2">
                        {onCancel && !showFormControls && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                        >
                            Save Quiz
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddQuiz;
import React, { useState } from 'react';

type EditQuizProps = {
  quizId: string;
  currentTitle: string;
  currentDescription: string;
  currentCourseCode: string;
  onClose: () => void;
  onSave: (updatedQuiz: {
    title: string;
    description: string;
    courseCode: string;
  }) => void;
};

const EditQuiz: React.FC<EditQuizProps> = ({
  
  currentTitle,
  currentDescription,
  currentCourseCode,
  onClose,
  onSave
}) => {
  const [quizData, setQuizData] = useState({
    title: currentTitle,
    description: currentDescription,
    courseCode: currentCourseCode
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(quizData);
  };

  return (
    <div className="fixed inset-0 bg-gray-800/90 flex justify-center items-center z-50">
      <div className="w-4/6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Quiz Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={quizData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={quizData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              value={quizData.courseCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
import React, { useEffect, useState } from 'react';
import { Category, EditQuizProps } from "../Types";

interface ExtendedEditQuizProps extends EditQuizProps {
	quizId: string;
	onClose: () => void;
	onSave: (updatedQuiz: {
		title: string;
		description: string;
		courseCode: string;
		publishedStatus: boolean;
		categoryId: number;
	}) => void;
}

const EditQuiz: React.FC<ExtendedEditQuizProps> = ({
	...existingProps // currentTitle, currentDescription, currentCourseCode, currentPublishedStatus, currentCategoryId, onClose, onSave
}) => {
  const [quizData, setQuizData] = useState({
    title: existingProps.currentTitle,
    description: existingProps.currentDescription,
    courseCode: existingProps.currentCourseCode,
    publishedStatus: existingProps.currentPublishedStatus,
    categoryId: existingProps.currentCategoryId || 0,
    publishedDate: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories: ", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value
    }));
  };

  const handleToggleChange = () => {
    setQuizData(prev => ({
      ...prev,
      publishedStatus: !prev.publishedStatus
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    existingProps.onSave({
      title: quizData.title,
      description: quizData.description,
      courseCode: quizData.courseCode,
      publishedStatus: quizData.publishedStatus,
      categoryId: quizData.categoryId
    });
    existingProps.onClose();
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

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={quizData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="publishedStatus" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="publishedStatus"
                  className="sr-only"
                  checked={quizData.publishedStatus}
                  onChange={handleToggleChange}
                />
                <div className={`block w-14 h-8 rounded-full ${quizData.publishedStatus ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${quizData.publishedStatus ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 font-medium text-gray-700">
                {quizData.publishedStatus ? 'Published' : 'Not Published'}
              </span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={existingProps.onClose}
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, QuizTypes } from '../Types';
import QuizCard from './QuizCard';

const StudentView = () => {
  const [publishedQuizzes, setPublishedQuizzes] = useState<QuizTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'categories'>('quizzes');
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'quizzes') {
      fetchPublishedQuizzes();
    } else if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab]);

  const fetchPublishedQuizzes = () => {
    setIsLoading(true);
    fetch("http://localhost:8080/quizzes/published", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPublishedQuizzes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching published quizzes:", error);
        setIsLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch("http://localhost:8080/categories", {
      method: "GET",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      setCategories(data);
    })
  };

  const handleQuizClick = (quizId: number | undefined) => {
    navigate(`/student/quiz/${quizId}`);
  };

  const handleSwitchToTeacherView = () => {
    navigate('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
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

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {activeTab === 'quizzes' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800">Available Quizzes</h1>
              <button
                onClick={handleSwitchToTeacherView}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
              >
                Switch to Teacher View
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : publishedQuizzes.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No published quizzes available at the moment.</p>
              </div>
            ) : (
              <QuizCard quizzes={publishedQuizzes} handleQuizClick={handleQuizClick}/>
            )}
          </>
        )}

        {activeTab === 'categories' && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Categories</h1>
            <div className="block w-full gap-6">
              {categories.map((category) => (
                <div key={category.categoryId}
                  className=" flex items-center my-2 justify-start border-b-blue-100 border-b-2 text-pretty"
                >
                  <h2
                    className="text-xl w-2/6 font-semibold mb-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/quizzes/categories/${category.title}`)}
                  >
                    {category.title}
                  </h2>
                  <p className="text-sm w-4/6">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentView;
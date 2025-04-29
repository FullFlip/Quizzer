import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizTypes } from '../Types';

const StudentView = () => {
  const [publishedQuizzes, setPublishedQuizzes] = useState<QuizTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublishedQuizzes();
  }, []);

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
        console.log(data);
        
        setPublishedQuizzes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching published quizzes:", error);
        setIsLoading(false);
      });
  };

  const handleQuizClick = (quizId: number | undefined) => {
    navigate(`/student/quiz/${quizId}`);
  };

  const handleSwitchToTeacherView = () => {
    navigate('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleQuizClick(quiz.id)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:-translate-y-1 cursor-pointer"
              >
                <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                <p className="text-sm mb-3">{quiz.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-blue-800 px-2 py-1 rounded">{quiz.courseCode}</span>
                  <span>Published: {quiz.publishedDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentView;
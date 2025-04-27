import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizTypes } from '../Types';

const StudentQuizView = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizData, setQuizData] = useState<QuizTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  const fetchQuizDetails = () => {
    setIsLoading(true);
    fetch(`http://localhost:8080/quizzes/${quizId}/questions`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setQuizData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quiz details:', error);
        setIsLoading(false);
      });
  };

  const handleBackClick = () => {
    navigate('/student');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Quizzes
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Quiz Details</h1>
        </div>

        {quizData ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{quizData.title}</h2>
              <p className="mb-4">{quizData.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-800 px-2 py-1 rounded">{quizData.courseCode}</span>
                <span>This quiz has {quizData.questions.length} questions</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-yellow-800">
                To take this quiz, please contact your teacher for instructions.
              </p>
            </div>

            {/* Questions Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Questions</h2>
              <div className="space-y-6">
                {quizData.questions.map((question, qIndex) => (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Question {qIndex + 1}: {question.title}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-lg font-medium text-gray-700 mb-2">Choices:</h4>
                      <ul className="space-y-2">
                        {question.choices.map((choice) => (
                          <li 
                            key={choice.choiceId} 
                            className="p-3 rounded-md bg-gray-50 border border-gray-200"
                          >
                            {choice.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg">Quiz not found or not available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuizView;
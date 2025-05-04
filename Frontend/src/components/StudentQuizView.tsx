import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizTypes } from '../Types';
import QuizForm from './QuizForm';

const StudentQuizView = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizData, setQuizData] = useState<QuizTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    answers: Record<number, number>,
    correctCount: number,
    totalQuestions: number
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizDetails();
    // Check if we have saved results for this quiz
    const savedResults = localStorage.getItem(`quiz_results_${quizId}`);
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults));
      setIsSubmitted(true);
    }
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

  const handleQuizSubmit = (answers: Record<number, number>) => {
    // Calculate results
    let correctCount = 0;

    if (quizData) {
      quizData.questions.forEach((question) => {
        const selectedChoiceId = answers[question.id];
        const selectedChoice = question.choices.find((c) => c.choiceId === selectedChoiceId);
        if (selectedChoice && selectedChoice.true) {
          correctCount++;
        }
      });

      // Save results
      const results = {
        answers,
        correctCount,
        totalQuestions: quizData.questions.length,
      };

      // Save to localStorage
      localStorage.setItem(`quiz_results_${quizId}`, JSON.stringify(results));

      console.log(results);
      
      // Submit answers to the backend
      fetch(`http://localhost:8080/answers/${quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Answers submitted successfully:", data);
        })
        .catch((error) => {
          console.error("Error submitting answers:", error);
        });

      setQuizResults(results);
      setIsSubmitted(true);
    }

    console.log("Quiz submitted with answers:", answers);
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

            {!isSubmitted ? (
              <>
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-blue-800">
                    Select one answer for each question and click the "Check Answer" button to see if you're correct.
                    When you've completed all questions, click "Submit Quiz".
                  </p>
                </div>

                {/* QuizForm Component */}
                <QuizForm
                  quizData={quizData}
                  onSubmit={handleQuizSubmit}
                />
              </>
            ) : (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Quiz Submitted!</h2>

                {quizResults && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-6">
                      <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg">
                        <svg className="w-10 h-10" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="3"
                            strokeDasharray={`${(quizResults.correctCount / quizResults.totalQuestions) * 100}, 100`}
                          />
                          <text x="18" y="20.5" textAnchor="middle" fill="#10B981" fontSize="10px" fontWeight="bold">
                            {`${Math.round((quizResults.correctCount / quizResults.totalQuestions) * 100)}%`}
                          </text>
                        </svg>
                      </div>
                    </div>

                    <p className="text-green-700 text-center text-lg font-medium">
                      You answered {quizResults.correctCount} out of {quizResults.totalQuestions} questions correctly.
                    </p>

                    <button
                      onClick={() => {
                        // Clear results and retake quiz
                        localStorage.removeItem(`quiz_results_${quizId}`);
                        setQuizResults(null);
                        setIsSubmitted(false);
                      }}
                      className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Retake Quiz
                    </button>

                    <button
                      onClick={() => {
                        // View detailed results
                        navigate(`/student/quiz/${quizId}/results`);
                      }}
                      className="mt-2 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Detailed Results
                    </button>
                  </div>
                )}
              </div>
            )}
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
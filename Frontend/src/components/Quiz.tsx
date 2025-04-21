import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddQuestion from './AddQuestion';
import EditQuiz from './EditQuiz';

type QuizTypes = {
  quizId?: number;
  title: string;
  description: string;
  courseCode: string;
  publishedStatus?: boolean;
  publishedDate?: string;
  questions: {
    id: number;
    title: string;
    difficulty: string;
    choices: {
      description: string;
      true: boolean;
    }[];
  }[];
};

const Quiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [data, setData] = useState<QuizTypes | undefined>(undefined);
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [openEditQuiz, setOpenEditQuiz] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "";

  const fetchData = () => {
    fetch(`${apiUrl}/quizzes/${quizId}/questions`, {
      method: 'GET',
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
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const handleAddQuestionClick = () => {
    setOpenAddQuestion(!openAddQuestion);
  };

  const handleEditQuizClick = () => {
    setOpenEditQuiz(!openEditQuiz);
  };

  const handleSaveQuiz = (updatedQuiz: {
    title: string;
    description: string;
    courseCode: string;
  }) => {
    fetch(`${apiUrl}/quizzes/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updatedQuiz,
        publishedStatus: data?.publishedStatus || false,
        publishedDate: data?.publishedDate || new Date().toISOString().split('T')[0],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((updatedData) => {
        setData(updatedData);
        setOpenEditQuiz(false);
      })
      .catch((error) => {
        console.error('Error updating quiz:', error);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Quiz Details</h1>
          <button 
            onClick={handleEditQuizClick}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            Edit Quiz
          </button>
        </div>
        
        <p className="text-lg text-gray-600 mb-2">
          <span className="font-semibold">Quiz ID:</span> {quizId}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          <span className="font-semibold">Course Code:</span> {data?.courseCode}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          <span className="font-semibold">Title:</span> {data?.title}
        </p>
        <p className="text-lg text-gray-600 mb-6">
          <span className="font-semibold">Description:</span> {data?.description}
        </p>
        <div className='flex justify-between py-2'>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Questions</h2>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600' onClick={handleAddQuestionClick}>Add question</button>
        </div>
        <ul className="space-y-4">
          {data?.questions.map((question) => (
            <li
              key={question.id}
              className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-medium text-gray-800">{question.title}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Difficulty:</span> {question.difficulty}
              </p>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Choices:</h3>
              <ul className="space-y-1">
                {question.choices.map((choice, index) => (
                  <li
                    key={index}
                    className={`p-2 rounded-lg ${choice.true ? 'bg-green-100' : 'bg-red-100'
                      }`}
                  >
                    <p className="text-gray-800">{choice.description}</p>
                    <p className="text-sm text-gray-600">
                      {choice.true ? 'Correct' : 'Incorrect'}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      
      {openAddQuestion && (<AddQuestion quizId={quizId} handleAddQuestionClick={handleAddQuestionClick} />)}

      
      {openEditQuiz && data && (
        <EditQuiz
          quizId={quizId || ''}
          currentTitle={data.title}
          currentDescription={data.description}
          currentCourseCode={data.courseCode}
          onClose={() => setOpenEditQuiz(false)}
          onSave={handleSaveQuiz}
        />
      )}
    </div>
  );
};

export default Quiz;
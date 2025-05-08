import './App.css';
import { Routes, Route } from 'react-router-dom';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import StudentView from './components/StudentView';
import StudentQuizView from './components/StudentQuizView';
import QuizByCategory from './components/QuizByCategory';
import ResultsPage from './components/ResultsPage';
import ReviewForQuiz from './components/ReviewForQuiz';

const secretLink =import.meta.env.VITE_SECRET_LINK;

const App = () => {
  return (
    <Routes>
      <Route path={`/${secretLink}`} element={<QuizList />} />
      <Route path="/quiz/:quizId" element={<Quiz />} />
      <Route path="/student" element={<StudentView />} />
      <Route path="/student/quiz/:quizId" element={<StudentQuizView />} />
      <Route path="/quizzes/categories/:category" element={<QuizByCategory />} />
      <Route path="/results/:quizId" element={<ResultsPage />} />
      <Route path="/reviews/:quizId" element={<ReviewForQuiz />} />
    </Routes>
  );
};

export default App;
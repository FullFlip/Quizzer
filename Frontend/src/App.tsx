import { Route, Routes } from 'react-router-dom';
import './App.css';
import Quiz from './components/Quiz';
import QuizByCategory from './components/QuizByCategory';
import QuizList from './components/QuizList';
import ResultsPage from './components/ResultsPage';
import ReviewForQuiz from './components/ReviewForQuiz';
import StudentQuizView from './components/StudentQuizView';
import StudentView from './components/StudentView';

const secretLink =import.meta.env.VITE_SECRET_LINK;

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentView />} />
      <Route path={`/${secretLink}`} element={<QuizList />} />
      <Route path="/selectedquiz/:quizId" element={<Quiz />} />
      <Route path="/student" element={<StudentView />} />
      <Route path="/studentquiz/:quizId" element={<StudentQuizView />} />
      <Route path="/quizzesbycategory/:category" element={<QuizByCategory />} />
      <Route path="/results/:quizId" element={<ResultsPage />} />
      <Route path="/reviews/:quizId" element={<ReviewForQuiz />} />
    </Routes>
  );
};

export default App;
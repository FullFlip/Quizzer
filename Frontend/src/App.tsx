import './App.css'
import { Routes, Route } from 'react-router-dom';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import StudentView from './components/StudentView';
import StudentQuizView from './components/StudentQuizView';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<QuizList />} />
      <Route path="/quiz/:quizId" element={<Quiz />} />
      <Route path="/student" element={<StudentView />} />
      <Route path="/student/quiz/:quizId" element={<StudentQuizView />} />
    </Routes>
  );
};

export default App;

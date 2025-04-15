import './App.css'
import { Routes, Route } from 'react-router-dom';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<QuizList />} />
      <Route path="/quiz/:quizId" element={<Quiz />} />
    </Routes>
  );
};

export default App;

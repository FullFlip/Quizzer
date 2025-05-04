import { QuizCardProps } from "../Types";

const QuizCard = ({ quizzes, handleQuizClick }: QuizCardProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {quizzes.map((quiz) => (
                <div
                    key={quiz.quizId}
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
    )
}

export default QuizCard;
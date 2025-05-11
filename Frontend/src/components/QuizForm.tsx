import { useState } from 'react';
import { QuizTypes } from '../Types';

type QuizFormProps = {
    quizData: QuizTypes;
    onSubmit: (answers: Record<number, number>) => void;
};

const QuizForm = ({ quizData, onSubmit }: QuizFormProps) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>({});
    const [lockedQuestions, setLockedQuestions] = useState<Set<number>>(new Set());

    const handleChoiceSelect = (questionId: number, choiceId: number) => {
        // Prevent changing answer if question is locked after checking
        if (lockedQuestions.has(questionId)) {
            return;
        }

        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: choiceId
        }));

    };

    const handleCheckAnswer = (questionId: number) => {
        if (!selectedAnswers[questionId]) {
            alert('Please select an answer first!');
            return;
        }

        const question = quizData.questions.find(q => q.id === questionId);
        if (!question) return;

        const selectedChoiceId = selectedAnswers[questionId];
        const selectedChoice = question.choices.find(c => c.choiceId === selectedChoiceId);

        if (selectedChoice) {
            setCheckedAnswers(prev => ({
                ...prev,
                [questionId]: selectedChoice.true
            }));

            // Lock this question after checking
            setLockedQuestions(prev => new Set([...prev, questionId]));
        }
    };

    const handleSubmit = () => {
        // Validate that all questions have an answer
        if (Object.keys(selectedAnswers).length < quizData.questions.length) {
            alert('Please answer all questions before submitting!');
            return;
        }

        onSubmit(selectedAnswers);
    };

    // If the quiz has no questions, show a message instead
    if (!quizData.questions || quizData.questions.length === 0) {
        return (
            <div className="mt-8 py-10 text-center bg-gray-50 rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Questions Available</h3>
                <p className="mt-1 text-gray-500">This quiz currently has no questions.</p>
            </div>
        );
    }

    return (
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
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Choose one:</h4>

                            <div className="space-y-2">
                                {question.choices.map((choice) => (
                                    <div
                                        key={choice.choiceId}
                                        onClick={() => handleChoiceSelect(question.id, choice.choiceId)}
                                        className={`p-3 rounded-md transition-colors ${lockedQuestions.has(question.id)
                                            ? 'cursor-not-allowed opacity-80'
                                            : 'cursor-pointer hover:bg-gray-100'
                                            } ${selectedAnswers[question.id] === choice.choiceId
                                                ? 'bg-blue-100 border-blue-300 border-2'
                                                : 'bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 
                        ${selectedAnswers[question.id] === choice.choiceId
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : 'border-gray-400'}`}
                                            >
                                                {selectedAnswers[question.id] === choice.choiceId &&
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                }
                                            </div>
                                            <span>{choice.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Feedback area */}
                            {checkedAnswers[question.id] !== undefined && (
                                <div className={`mt-4 p-3 rounded-md ${checkedAnswers[question.id]
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-red-100 text-red-800 border border-red-300'
                                    }`}>
                                    {checkedAnswers[question.id]
                                        ? '✓ Correct! Well done.'
                                        : '✗ Incorrect.'}
                                </div>
                            )}

                            {/* Check Answer button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleCheckAnswer(question.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                    disabled={!selectedAnswers[question.id] || lockedQuestions.has(question.id)}
                                >
                                    {lockedQuestions.has(question.id) ? 'Answer Checked' : 'Check Answer'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-green-700 transition-colors"
                >
                    Submit Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizForm;
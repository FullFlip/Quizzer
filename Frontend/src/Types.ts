export type QuizTypes = {
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
            choiceId: number;
            description: string;
            true: boolean;
        }[];
    }[];
};

export type QuestionProps = {
    id: number;
    title: string;
    difficulty: string;
    choices: never[];
    quizId: string | undefined;
    handleAddQuestionClick?: (shouldClose: boolean) => void;
    questionToEdit?: {
        id: number;
        title: string;
        difficulty: string;
        choices: {
            choiceId: number;
            description: string;
            true: boolean;
        }[];
    };
};

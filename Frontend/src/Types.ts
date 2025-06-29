export type QuizTypes = {
    quizId?: number;
    title: string;
    description: string;
    courseCode: string;
    publishedStatus?: boolean;
    publishedDate?: string;
    category?: {
        categoryId: number;
        title: string;
        description?: string;
    };
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

export type AddChoiceProps = {
    choice: {
        id: number;
        answer: string;
        isCorrect: boolean;
    };
    onChange: (id: number, value: string) => void;
    onToggleCorrect: (id: number) => void;
    onDelete: (id: number) => void;
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

export type Question = {
    id: number;
    title: string;
    difficulty: string;
    answers: {
        id: number;
        correctAnswers: number;
        totalAnswers: number;
        wrongAnswers: number;
    }[];
}

export type QuizFormData = {
    title: string;
    description: string;
    courseCode: string;
    categoryId: number,
    publishedStatus: boolean;
}

export type Category = {
    categoryId: number;
    title: string;
    description: string;
}

export type AddQuizProps = {
    onAddQuiz: (quizToAdd: {
        title: string;
        description: string;
        courseCode: string;
        publishedStatus: boolean;
        publishedDate: string;
        categoryId: number;
        teacher: { teacherId: number };
    }) => void;
    showFormControls: boolean;
    onCancel?: () => void;
};

export type EditQuizProps = {
    quizId: string;
    currentTitle: string;
    currentDescription: string;
    currentCourseCode: string;
    currentPublishedStatus: boolean;
    currentCategoryId?: number;

    onClose: () => void;
    onSave: (updatedQuiz: {
        title: string;
        description: string;
        courseCode: string;
        publishedStatus: boolean;
        categoryId: number;
    }) => void;
};

export type QuizCardProps = {
    quizzes: QuizTypes[];
    handleQuizClick: (quizId: number | undefined) => void;
}
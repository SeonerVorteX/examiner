export interface UserPayload {
    _id: string;
    email: string;
    fullname: string;
    group: string;
    groupNames: string;
    accessToken: string;
}

export interface UserInformation {
    _id: string;
    email: string;
    createdDate: number;
    updatedDate: number;
}

export interface APIError {
    code: number;
    message: string;
}

// Exam
export interface Exam {
    id: number;
    title: string;
}

export interface ActiveExam {
    id: number;
    startDate: number;
    finishDate: number;
    isActive: boolean;
    user: string;
    details: ExamDetails;
    userAnswers: { question: number; index: number }[];
}

export interface FinishedExam {
    id: number;
    startDate: number;
    finishDate: number;
    finishedAt: number;
    isActive: boolean;
    user: string;
    details: ExamDetails;
    results: ExamResults;
}

export interface ExamDetails {
    examId: number;
    title: string;
    settings: ExamSettings;
    questions: ExamQuestion[];
}

export interface ExamSettings {
    questionCount: number;
    showAnswer?: boolean;
    selectQuestionsYourself?: boolean;
    startPoint?: number;
    endPoint?: number;
}

export interface ExamResults {
    correctCount: number;
    wrongCount: number;
    emptyCount: number;
    score: number;
    scorePercent: number;
    answers: { question: ExamQuestion; index: number; _id: string }[];
}

export interface ExamQuestion {
    _id: string;
    row: number;
}

export interface QuestionType {
    _id: string;
    row: number;
    question: {
        isImage: boolean;
        isBoth: boolean;
        imgValue?: number;
        value: string | number;
    };
    answers: OptionType;
    options: OptionType[];
}

export interface OptionType {
    isImage: boolean;
    value: string | number;
    _id: string;
    isCorrect?: boolean;
}

export interface ImageType {
    _id: string;
    id: number;
    type: number;
    bothId: number;
    data: {
        type: "Buffer";
        data: number[];
    };
}

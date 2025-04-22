package com.haagahelia.quizzer.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.haagahelia.quizzer.model.Choice;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.repositories.ChoiceRepository;
import com.haagahelia.quizzer.repositories.QuestionRepository;
import com.haagahelia.quizzer.repositories.QuizRepository;

@Service
public class QuestionOperationService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ChoiceRepository choiceRepository;

    public Question addQuestionWithChoices(Question question, Long quizId) {
        if (question == null || question.getChoices() == null) {
            throw new IllegalArgumentException("Question, its choices, or associated quiz are not provided or are invalid.");
        }
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));
        question.setQuiz(quiz);
        Question savedQuestion = questionRepository.save(question);
        for (Choice choice : question.getChoices()) {
            choice.setQuestion(savedQuestion);
            choiceRepository.save(choice);
        }
        return savedQuestion;
    }

    public void deleteQuestionWithId(Long id) {
        questionRepository.deleteById(id);
    }
}

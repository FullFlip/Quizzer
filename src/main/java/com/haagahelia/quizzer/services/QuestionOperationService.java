package com.haagahelia.quizzer.services;

import java.util.ArrayList;
import java.util.List;

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
            throw new IllegalArgumentException(
                    "Question, its choices, or associated quiz are not provided or are invalid.");
        }

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));

        question.setQuiz(quiz);

        List<Choice> managedChoices = new ArrayList<>();
        for (Choice choice : question.getChoices()) {
            choice.setChoiceId(null);
            choice.setQuestion(question);
            managedChoices.add(choice);
        }
        question.setChoices(managedChoices);

        return questionRepository.save(question);
    }

    public void deleteQuestionWithId(Long id) {
        questionRepository.deleteById(id);
    }

    public void updateQuestion(Long questionId, Question updatedQuestion) {
        if (updatedQuestion == null || updatedQuestion.getChoices() == null) {
            throw new IllegalArgumentException("Updated question or its choices are not provided or are invalid.");
        }

        Question existingQuestion = questionRepository.findById(questionId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Question with id " + questionId + " could not be found"));

        existingQuestion.setTitle(updatedQuestion.getTitle());
        existingQuestion.setDifficulty(updatedQuestion.getDifficulty());

        choiceRepository.deleteAll(existingQuestion.getChoices());

        for (Choice choice : updatedQuestion.getChoices()) {
            choice.setQuestion(existingQuestion);
            choiceRepository.save(choice);
        }

        questionRepository.save(existingQuestion);
    }

}

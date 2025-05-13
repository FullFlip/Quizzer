package com.haagahelia.quizzer.services;

import com.haagahelia.quizzer.dto.AnswerDto;
import com.haagahelia.quizzer.model.Answer;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Choice;
import com.haagahelia.quizzer.repositories.AnswerRepository;
import com.haagahelia.quizzer.repositories.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public void addAnswer(Long quizId, AnswerDto answerDto) {
        // Validate input
        if (answerDto == null || answerDto.getAnswers() == null || answerDto.getAnswers().isEmpty()) {
            throw new IllegalArgumentException("Answer data is invalid or missing answer options");
        }

        Collection<Integer> idValues = answerDto.getAnswers().values();

        List<Question> questions = questionRepository.findAllByQuizId(quizId);
        for (Question question : questions) {

            Answer existingAnswer = answerRepository.findByQuestionId(question.getId());

            int correctCount = 0;
            int wrongCount = 0;

            for (Choice choice : question.getChoices()) {
                if (choice.isTrue() && idValues.contains(choice.getChoiceId().intValue())) {
                    correctCount++;
                } else {
                    wrongCount++;
                }
            }

            if (correctCount >= 1) {
                wrongCount = 0;
                correctCount = 1;
            } else {
                wrongCount = 1;
                correctCount = 0;
            }

            if (existingAnswer != null) {
                int totalAnswers = existingAnswer.getTotalAnswers() + 1;
                int correctAnswers = existingAnswer.getCorrectAnswers() + correctCount;
                int wrongAnswers = existingAnswer.getWrongAnswers() + wrongCount;

                existingAnswer.setTotalAnswers(totalAnswers);
                existingAnswer.setCorrectAnswers(correctAnswers);
                existingAnswer.setWrongAnswers(wrongAnswers);
                answerRepository.save(existingAnswer);

            } else {
                Answer newAnswer = new Answer();
                newAnswer.setQuestion(question);
                newAnswer.setTotalAnswers(1);
                newAnswer.setCorrectAnswers(correctCount);
                newAnswer.setWrongAnswers(wrongCount);
                answerRepository.save(newAnswer);
            }
        }
    }

    public List<Answer> getAllAnswers() { // New method to work with createAnswerSavesAnswerForPublishedQuiz
        return answerRepository.findAll();
    }

    public Answer getAllAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

}

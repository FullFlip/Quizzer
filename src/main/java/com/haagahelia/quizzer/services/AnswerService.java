package com.haagahelia.quizzer.services;

import com.haagahelia.quizzer.dto.AnswerDto;
import com.haagahelia.quizzer.model.Answer;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.repositories.AnswerRepository;
import com.haagahelia.quizzer.repositories.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public AnswerService(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    // Add a new answer
    public void addAnswer(Long quizId, AnswerDto answerDto) {

        List<Question> questions = questionRepository.findAllByQuizId(quizId);
        for (Question question : questions) {

            Answer existingAnswer = answerRepository.findByQuestionId(question.getId());

            if (existingAnswer != null) {

                int totalAnswers = existingAnswer.getTotalAnswers() + 1;
                int correctAnswers = existingAnswer.getCorrectAnswers() + answerDto.getCorrectCount();
                int wrongAnswers = existingAnswer.getWrongAnswers()
                        + (answerDto.getTotalQuestions() - answerDto.getCorrectCount());

                existingAnswer.setTotalAnswers(totalAnswers);
                existingAnswer.setCorrectAnswers(correctAnswers);
                existingAnswer.setWrongAnswers(wrongAnswers);
                answerRepository.save(existingAnswer);

            } else {
                // Create a new answer if none exists
                Answer newAnswer = new Answer();
                newAnswer.setQuestion(question);
                newAnswer.setTotalAnswers(1);
                newAnswer.setCorrectAnswers(answerDto.getCorrectCount());
                newAnswer.setWrongAnswers(answerDto.getTotalQuestions() - answerDto.getCorrectCount());
                answerRepository.save(newAnswer);
            }
        }
    }

    public Answer getAllAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

}

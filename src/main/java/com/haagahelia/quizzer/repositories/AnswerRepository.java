package com.haagahelia.quizzer.repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.haagahelia.quizzer.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Answer findByQuestionId(Long questionId);

}

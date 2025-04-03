package com.haagahelia.quizzer.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.haagahelia.quizzer.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long>{
    
}

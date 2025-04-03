package com.haagahelia.quizzer.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.haagahelia.quizzer.model.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    
}
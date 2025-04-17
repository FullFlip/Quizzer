package com.haagahelia.quizzer.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.haagahelia.quizzer.model.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findAllByTeacher_TeacherId(Long teacherId);
 

}
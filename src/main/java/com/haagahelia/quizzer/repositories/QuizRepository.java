package com.haagahelia.quizzer.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.haagahelia.quizzer.model.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findAllByTeacher_TeacherId(Long teacherId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Quiz q WHERE q.id = :id")
    void deleteQuizById(Long id);

    List<Quiz> findByPublishedStatus(boolean publishedStatus);

    List<Quiz> findByCategory_Title(String title);
}
package com.haagahelia.quizzer.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.haagahelia.quizzer.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByQuizQuizId(Long quizId);
}

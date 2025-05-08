package com.haagahelia.quizzer.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Review;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.repositories.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private QuizRepository quizRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByQuizId(Long quizId) {
        return reviewRepository.findByQuizQuizId(quizId);
    }

    public Review addReview(Long quizId, Review review) {
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty()) {
            throw new IllegalArgumentException("Quiz with ID " + quizId + " not found");
        }
        review.setQuiz(quizOptional.get());
        // Ensure nickname is set
        if (review.getNickname() == null || review.getNickname().isBlank()) {
            review.setNickname("Anonymous");
        }
        return reviewRepository.save(review);
    }

    public Review editReview(Long reviewId, Long quizId, Review updatedReview) {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isEmpty()) {
            throw new IllegalArgumentException("Review with ID " + reviewId + " not found");
        }
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty()) {
            throw new IllegalArgumentException("Quiz with ID " + quizId + " not found");
        }
        Review existingReview = reviewOptional.get();
        existingReview.setComment(updatedReview.getComment());
        existingReview.setReviewValue(updatedReview.getReviewValue());
        existingReview.setNickname(updatedReview.getNickname()); // Update nickname
        existingReview.setQuiz(quizOptional.get());
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new IllegalArgumentException("Review with ID " + reviewId + " not found");
        }
        reviewRepository.deleteById(reviewId);
    }
}

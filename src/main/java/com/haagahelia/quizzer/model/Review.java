package com.haagahelia.quizzer.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "comment", nullable = false)
    private String comment;

    @Column(name = "review_value", nullable = false) // Updated column name
    private int reviewValue; // Renamed field

    @Column(name = "nickname", nullable = true) // New nullable field
    private String nickname;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnoreProperties("reviews") // Prevent infinite recursion
    private Quiz quiz;

    public Review() {
        super();
    }

    public Review(String comment, int reviewValue, String nickname, Quiz quiz) {
        this.comment = comment;
        this.reviewValue = reviewValue;
        this.nickname = nickname;
        this.quiz = quiz;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getReviewValue() { // Updated getter
        return reviewValue;
    }

    public void setReviewValue(int reviewValue) { // Updated setter
        if (reviewValue < 0 || reviewValue > 5) {
            throw new IllegalArgumentException("Review value must be between 0 and 5.");
        }
        this.reviewValue = reviewValue;
    }

    public String getNickname() { // New getter
        return nickname;
    }

    public void setNickname(String nickname) { // New setter
        this.nickname = nickname;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    @Override
    public String toString() {
        return "Review [id=" + id + ", comment=" + comment + ", reviewValue=" + reviewValue + ", nickname=" + nickname + ", quizId=" + quiz.getId() + "]";
    }
}

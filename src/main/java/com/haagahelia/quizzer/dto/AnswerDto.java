package com.haagahelia.quizzer.dto;

import java.util.Map;

public class AnswerDto {
    private Map<Integer, Integer> answers;
    private int correctCount;
    private int totalQuestions;

    // Getters and Setters
    public Map<Integer, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Integer, Integer> answers) {
        this.answers = answers;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    // Constructor
    public AnswerDto(Map<Integer, Integer> answers, int correctCount, int totalQuestions) {
        this.answers = answers;
        this.correctCount = correctCount;
        this.totalQuestions = totalQuestions;
    }

    // Default Constructor
    public AnswerDto() {
    }

    @Override
    public String toString() {
        return "AnswerDto{" +
                "answers=" + answers +
                ", correctCount=" + correctCount +
                ", totalQuestions=" + totalQuestions +
                '}';
    }
}

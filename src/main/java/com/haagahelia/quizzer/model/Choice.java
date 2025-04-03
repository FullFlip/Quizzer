package com.haagahelia.quizzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "choice_id", nullable = false, updatable = false)
    private Long choiceId;

    @Column(name = "is_true", nullable = false)
    private boolean isTrue;

    @Column(name = "description", nullable = false, updatable = false)
    private String description;

    @ManyToOne
    private Question question;

    public Choice(boolean isTrue, String description) {
        this.isTrue = isTrue;
        this.description = description;
    }

    public Choice() {
        super();
    }

    public boolean isTrue() {
        return isTrue;
    }

    public void setTrue(boolean isTrue) {
        this.isTrue = isTrue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

   

    public void setQuestion(Question question) {
        this.question = question;
    }

    @Override
    public String toString() {
        return "Choice [choiceId=" + choiceId + ", isTrue=" + isTrue + ", description=" + description + "]";
    }

}

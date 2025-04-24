package com.haagahelia.quizzer.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id", nullable = false, updatable = false)
    private Long quizId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "code", nullable = false, updatable = false)
    private String courseCode;

    @Column(name = "published_status", nullable = false)
    private boolean publishedStatus;

    @Column(name = "published_date", nullable = false)
    private LocalDate publishedDate;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

    public Quiz() {
        super();
    }

    public Quiz(String title, String description, String courseCode, boolean publishedStatus,
            List<Question> questions) {
        this.title = title;
        this.description = description;
        this.courseCode = courseCode;
        this.publishedStatus = publishedStatus;
        this.publishedDate = LocalDate.now();
        this.questions = questions;
    }

    public Long getId() {
        return quizId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public boolean isPublishedStatus() {
        return publishedStatus;
    }

    public void setPublishedStatus(boolean publishedStatus) {
        this.publishedStatus = publishedStatus;
    }

    public LocalDate getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDate publishedDate) {
        this.publishedDate = publishedDate;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public Long getTeacherId() {
        return this.teacher.getTeacherId();
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    @Override
    public String toString() {
        return "Quiz [quizId=" + quizId + ", title=" + title + ", description=" + description + ", courseCode="
                + courseCode + ", publishedStatus=" + publishedStatus + ", publishedDate=" + publishedDate
                + ", questions=" + questions + ", teacher=" + teacher + "]";
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }
}

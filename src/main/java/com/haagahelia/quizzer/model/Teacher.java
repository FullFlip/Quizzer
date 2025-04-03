package com.haagahelia.quizzer.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_id", nullable = false, updatable = false)
    private Long teacherId;

    @Column(name = "name", nullable = false, updatable = false)
    private String name;

    @Column(name = "role", nullable = false, updatable = false)
    private String role;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Quiz> quizzes;

    public Teacher() {
        super();
    }

    public Teacher(Long id, String name) {
        this.teacherId = id;
        this.name = name;
    }

    public Teacher(String name, String role) {
        this.name = name;
        this.role = role;
    }

    public Teacher(String name, String role, List<Quiz> quizzes) {
        this.name = name;
        this.role = role;
        this.quizzes = quizzes;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Quiz> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<Quiz> quizzes) {
        this.quizzes = quizzes;
    }

    @Override
    public String toString() {
        return "Teacher [teacherId=" + teacherId + ", name=" + name + ", role=" + role + ", Amount of quizzes=" + quizzes.size() + "]";
    }

}

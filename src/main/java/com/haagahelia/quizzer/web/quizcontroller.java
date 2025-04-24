package com.haagahelia.quizzer.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.services.QuestionOperationService;
import com.haagahelia.quizzer.services.QuizOperationService;

import jakarta.transaction.Transactional;

@RestController
public class quizcontroller {

    @Autowired
    private QuizOperationService quizOperationService;

    @Autowired
    private QuestionOperationService questionOperationService;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/quizzes/{id}")
    public List<Quiz> getAllQuizzesByTeacher(@PathVariable Long id) {
        return quizOperationService.getAllQuizzesByTeacher(id);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/quizzes/{id}/questions")
    public Quiz getQuestionsForQuiz(@PathVariable Long id) {
        return quizOperationService.getQuizWithQuestions(id);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/quizzes")
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        return quizOperationService.addQuiz(quiz);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/quizzes/{id}")
    public Quiz editQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        return quizOperationService.editQuiz(id, updatedQuiz);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @Transactional
    @DeleteMapping("/quizzes/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizOperationService.deleteQuiz(id);
        System.out.println("Quiz with id " + id + " has been deleted.");
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/questions-with-choices")
    public Question addQuestionWithChoices(@RequestBody Question question, @RequestHeader("quizId") Long quizId) {
        return questionOperationService.addQuestionWithChoices(question, quizId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/question/{id}")
    public void deleteQuestionWithId(@PathVariable("id") Long questionId) {
        if (questionId == null) {
            throw new IllegalArgumentException("Invalid id");
        }
        questionOperationService.deleteQuestionWithId(questionId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/question/{id}")
    public void updateQuestionWithId(@PathVariable("id") Long questionId, @RequestBody Question question) {
    
        if (question == null) {
            throw new IllegalArgumentException("Provided question was null");
        }

        if (questionId == null) {
            throw new IllegalArgumentException("Invalid id");
        }
        questionOperationService.updateQuestion(questionId, question);
    }
}

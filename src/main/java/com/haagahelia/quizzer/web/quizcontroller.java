package com.haagahelia.quizzer.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.haagahelia.quizzer.dto.AnswerDto;
import com.haagahelia.quizzer.dto.QuizDto;
import com.haagahelia.quizzer.model.Category;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Review;
import com.haagahelia.quizzer.services.AnswerService;
import com.haagahelia.quizzer.services.CategoryService;
import com.haagahelia.quizzer.services.QuestionOperationService;
import com.haagahelia.quizzer.services.QuizOperationService;
import com.haagahelia.quizzer.services.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.transaction.Transactional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class quizcontroller {

    @Autowired
    private QuizOperationService quizOperationService;

    @Autowired
    private QuestionOperationService questionOperationService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "Get all quizzes", description = "Fetch all quizzes")
    @GetMapping("/quizzes")
    public List<Quiz> getAllQuizzes() {
        return quizOperationService.getAllQuizzes();
    }

    @Operation(summary = "Get all quizzes by teacher", description = "Fetch all quizzes with a specific teacher ID")
    @GetMapping("/quizzes/{id}")
    public List<Quiz> getAllQuizzesByTeacher(@PathVariable Long id) {
        return quizOperationService.getAllQuizzesByTeacher(id);
    }

    @Operation(summary = "Get questions for a quiz", description = "Fetch all questions for a specific quiz ID")
    @GetMapping("/quizzes/{id}/questions")
    public Quiz getQuestionsForQuiz(@PathVariable Long id) {
        return quizOperationService.getQuizWithQuestions(id);
    }

    @Operation(summary = "Get a quiz by ID", description = "Fetch a specific quiz by its ID")
    @GetMapping("/quiz/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizOperationService.getQuizById(id);
    }

    @Operation(summary = "Get published quizzes", description = "Fetch all published quizzes")
    @GetMapping("/quizzes/published")
    public List<Quiz> getPublishedQuizzes() {
        return quizOperationService.getPublishedQuizzes();
    }

    @Operation(summary = "Get the questions of the published questions", description = "Fetch all questions of published questions")
    @GetMapping("/quizzes/{id}/only-questions")
    public List<Question> getOnlyQuestionsForQuiz(@PathVariable Long id) {
        Quiz quiz = quizOperationService.getQuizWithQuestions(id);
        if (quiz != null) {
            return quiz.getQuestions();
        }
        return List.of();
    }

    @Operation(summary = "Get quizzes by category", description = "Fetch all quizzes for a specific category")
    @GetMapping("/quizzes/categories/{category}")
    public List<Quiz> getQuizzesByCategory(@PathVariable String category) {
        return quizOperationService.getQuizzesByCategory(category);
    }

    @Operation(summary = "Add a new quiz", description = "Create a new quiz with the provided details")
    @PostMapping("/quizzes")
    public Quiz addQuiz(@RequestBody QuizDto quiz) {
        return quizOperationService.addQuizDto(quiz);
    }

    @Operation(summary = "Edit an existing quiz", description = "Update the details of an existing quiz by ID")
    @PutMapping("/quizzes/{id}")
    public Quiz editQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        return quizOperationService.editQuiz(id, updatedQuiz);
    }

    @Operation(summary = "Delete a quiz", description = "Delete a quiz by its ID")
    @Transactional
    @DeleteMapping("/quizzes/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizOperationService.deleteQuiz(id);
        System.out.println("Quiz with id " + id + " has been deleted.");
    }

    @Operation(summary = "Add a question with choices", description = "Add a new question with choices to a specific quiz")
    @PostMapping("/questions-with-choices")
    public Question addQuestionWithChoices(@RequestBody Question question, @RequestHeader("quizId") Long quizId) {
        return questionOperationService.addQuestionWithChoices(question, quizId);
    }

    @Operation(summary = "Delete a question", description = "Delete a question by its ID")
    @DeleteMapping("/question/{id}")
    public void deleteQuestionWithId(@PathVariable("id") Long questionId) {
        if (questionId == null) {
            throw new IllegalArgumentException("Invalid id");
        }
        questionOperationService.deleteQuestionWithId(questionId);
    }

    @Operation(summary = "Update a question", description = "Update the details of a question by its ID")
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

    @Operation(summary = "Get all categories", description = "Fetch all available categories")
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @Operation(summary = "Add a new category", description = "Create a new category with the provided details")
    @PostMapping("/categories")
    public Category addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    @Operation(summary = "Delete a category", description = "Delete a category by its ID")
    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        System.out.println("Category with id " + id + " has been deleted.");
    }
//added this method to work with createAnswerSavesAnswerForPublishedQuiz
    @Operation(summary = "Get all answers", description = "Fetch all answers")
    @GetMapping("/answers")
    public List<com.haagahelia.quizzer.model.Answer> getAllAnswers() {
        return answerService.getAllAnswers();
    }

    @Operation(summary = "Submit answers for a quiz", description = "Submit answers for a specific quiz ID")
    @PostMapping("/answers/{quizId}")
    public Map<String, String> submitAnswer(@PathVariable Long quizId, @RequestBody AnswerDto answer) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Answers submitted successfully.");
        response.put("quizId", quizId.toString());
        answerService.addAnswer(quizId, answer);
        return response;
    }

    @Operation(summary = "Get all reviews", description = "Fetch all reviews")
    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @Operation(summary = "Get reviews by quiz ID", description = "Fetch all reviews for a specific quiz ID")
    @GetMapping("/reviews/quiz/{quizId}")
    public List<Review> getReviewsByQuizId(@PathVariable Long quizId) {
        return reviewService.getReviewsByQuizId(quizId);
    }

    @Operation(summary = "Add a review", description = "Add a new review for a specific quiz")
    @PostMapping("/reviews/quiz/{quizId}")
    public Review addReview(@PathVariable Long quizId, @RequestBody Review review) {
        if (review == null) {
            throw new IllegalArgumentException("Invalid review data: comment and reviewValue are required.");
        }
        try {
            return reviewService.addReview(quizId, review);
        } catch (Exception e) {
            System.err.println("Error adding review: " + e.getMessage());
            throw new RuntimeException("Failed to add review. Please check the server logs for details.");
        }
    }

    @Operation(summary = "Edit a review", description = "Update the details of an existing review by ID")
    @PutMapping("/reviews/{reviewId}/quiz/{quizId}")
    public Review editReview(@PathVariable Long reviewId, @PathVariable Long quizId, @RequestBody Review updatedReview) {
        return reviewService.editReview(reviewId, quizId, updatedReview);
    }

    @Operation(summary = "Delete a review", description = "Delete a review by its ID")
    @DeleteMapping("/reviews/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
}

package com.haagahelia.quizzer.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.haagahelia.quizzer.dto.QuizDto;
import com.haagahelia.quizzer.model.Category;
import com.haagahelia.quizzer.model.Choice;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.AnswerRepository;
import com.haagahelia.quizzer.repositories.CategoryRepository;
import com.haagahelia.quizzer.repositories.ChoiceRepository;
import com.haagahelia.quizzer.repositories.QuestionRepository;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.repositories.ReviewRepository;
import com.haagahelia.quizzer.repositories.TeacherRepository;

import jakarta.transaction.Transactional;

@Service
public class QuizOperationService {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Quiz> getAllQuizzesByTeacher(Long teacherId) {
        if (teacherId == null) {
            throw new IllegalArgumentException("Id is not provided or is invalid.");
        }
        Teacher teacher = teacherService.findTeacherById(teacherId);
        if (teacher == null) {
            throw new IllegalArgumentException("Teacher with id " + teacherId + " could not be found");
        }
        return quizRepository.findAllByTeacher_TeacherId(teacher.getTeacherId());
    }

    public Quiz getQuizWithQuestions(Long quizId) {
        if (quizId == null) {
            throw new IllegalArgumentException("Id is not provided or is invalid.");
        }
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz with id " + quizId + " could not be found");
        }
        return quiz;
    }

    public Quiz getQuizById(Long quizId) {
        if (quizId == null) {
            throw new IllegalArgumentException("Quiz ID is not provided or is invalid.");
        }
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));
    }

    public List<Quiz> getPublishedQuizzes() {
        return quizRepository.findByPublishedStatus(true);
    }

    public Quiz addQuiz(Quiz quiz) {
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz data is not provided or is invalid.");
        }
        return quizRepository.save(quiz);
    }

    public Quiz addQuizDto(QuizDto quiz) {
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz data is not provided or is invalid.");
        }
        Optional<Category> category = categoryRepository.findById(quiz.getCategoryId());
        if (category.isEmpty()) {
            throw new IllegalArgumentException("Category with id " + quiz.getCategoryId() + " could not be found");
        }

        Quiz newQuiz = new Quiz();
        newQuiz.setTitle(quiz.getTitle());
        newQuiz.setDescription(quiz.getDescription());
        newQuiz.setCourseCode(quiz.getCourseCode());
        newQuiz.setCategory(category.get());
        newQuiz.setPublishedStatus(quiz.isPublishedStatus());
        newQuiz.setPublishedDate(quiz.getPublishedDate());

        Teacher teacher = teacherRepository.findById(quiz.getTeacher().getTeacherId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Teacher with id " + quiz.getTeacher().getTeacherId() + " could not be found"));
        newQuiz.setTeacher(teacher);

        return quizRepository.save(newQuiz);
    }

    public Quiz editQuiz(Long quizId, Quiz updatedQuiz) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));
        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setDescription(updatedQuiz.getDescription());
        existingQuiz.setCourseCode(updatedQuiz.getCourseCode());
        existingQuiz.setPublishedStatus(updatedQuiz.isPublishedStatus());
        existingQuiz.setPublishedDate(updatedQuiz.getPublishedDate());
        if (updatedQuiz.getCategory() != null && updatedQuiz.getCategory().getCategoryId() != null) {
            Category category = categoryRepository.findById(updatedQuiz.getCategory().getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category with id " + updatedQuiz.getCategory().getCategoryId() + " could not be found"));
            existingQuiz.setCategory(category);
        }
        return quizRepository.save(existingQuiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));

        // Delete associated reviews
        if (quiz.getReviews() != null && !quiz.getReviews().isEmpty()) {
            reviewRepository.deleteAllInBatch(quiz.getReviews());
        }

        // Delete associated answers for each question
        List<Question> questions = quiz.getQuestions();
        List<Choice> choices = new ArrayList<>();
        for (Question question : questions) {
            if (question.getAnswers() != null && !question.getAnswers().isEmpty()) {
                answerRepository.deleteAllInBatch(question.getAnswers());
            }
            choices.addAll(question.getChoices());
        }

        // Delete choices and questions
        choiceRepository.deleteAllInBatch(choices);
        questionRepository.deleteAllInBatch(questions);

        // Finally, delete the quiz
        quizRepository.deleteQuizById(quizId);
    }

    public List<Quiz> getQuizzesByCategory(String category) {
        if (category == null || category.isEmpty()) {
            throw new IllegalArgumentException("Category is not provided or is invalid.");
        }

        List<Quiz> publishedQuizzesByCategory = new ArrayList<>();
        for (Quiz quiz : quizRepository.findByCategory_Title(category)) {
            if (quiz.isPublishedStatus()) {
                publishedQuizzesByCategory.add(quiz);
            }
        }

        return publishedQuizzesByCategory;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
}

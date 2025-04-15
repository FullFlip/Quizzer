package com.haagahelia.quizzer.web;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.QuestionRepository;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.services.QuizService;
import com.haagahelia.quizzer.services.TeacherService;

@RestController
public class quizcontroller {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/test")
    @ResponseBody
    public Stream<Teacher> testEndpoint() {
        return teacherService.findOnlyTeacherData();
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/quizzes/{id}")
    public List<Quiz> getAllQuizzesByTeacher(@PathVariable Long id) {

        if (id == null) {
            throw new IllegalArgumentException("Id is not provided or is invalid.");
        }

        Teacher teacherId = teacherService.findTeacherById(id);
        if (teacherId == null) {
            throw new IllegalArgumentException("Teacher with id " + id + " could not be found");
        }

        List<Quiz> listOfQuizzes = quizService.getAllQuizzesByTeacher(teacherId.getTeacherId());
        return listOfQuizzes;
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/quizzes")
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz data is not provided or is invalid.");
        }
        return quizRepository.save(quiz);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/quizzes/{id}")
    public Quiz editQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        Quiz existingQuiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + id + " could not be found"));
        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setDescription(updatedQuiz.getDescription());
        existingQuiz.setCourseCode(updatedQuiz.getCourseCode());
        existingQuiz.setPublishedStatus(updatedQuiz.isPublishedStatus());
        existingQuiz.setPublishedDate(updatedQuiz.getPublishedDate());
        return quizRepository.save(existingQuiz);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/quizzes/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + id + " could not be found"));
        quizRepository.delete(quiz);
    }

    // Enpoints for Question

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/questions")
    public Question addQuestion(@RequestBody Question question) {
        if (question == null) {
            throw new IllegalArgumentException("Question data is not provided or is invalid.");
        }
        return questionRepository.save(question);
    }

    @CrossOrigin(origins = "http://localhost:5173")
@PutMapping("/questions/{id}")
public Question editQuestion(@PathVariable Long id, @RequestBody Question updatedQuestion) {
    Question existingQuestion = questionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Question with id " + id + " could not be found"));
    existingQuestion.setTitle(updatedQuestion.getTitle());
    existingQuestion.setDifficulty(updatedQuestion.getDifficulty());
    existingQuestion.setChoices(updatedQuestion.getChoices());
    return questionRepository.save(existingQuestion);
}

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/questions/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question with id " + id + " could not be found"));
        questionRepository.delete(question);
    }

    @GetMapping("/matti")
    @ResponseBody
    public List<Teacher> mattiEndpoint() {
        return teacherService.findAllTeachers();
    }

    @GetMapping("/ville")
    @ResponseBody
    public List<Quiz> villeEndpoint() {
        return quizRepository.findAll();
    }

}

package com.haagahelia.quizzer.web;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.services.QuizService;
import com.haagahelia.quizzer.services.TeacherService;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class quizcontroller {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizRepository quizRepository;

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

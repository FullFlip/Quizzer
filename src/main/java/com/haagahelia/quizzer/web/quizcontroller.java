package com.haagahelia.quizzer.web;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.services.TeacherService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class quizcontroller {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private QuizRepository quizRepository;

    @GetMapping("/test")
    @ResponseBody
    public Stream<Teacher> testEndpoint() {
        return teacherService.findOnlyTeacherData();
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

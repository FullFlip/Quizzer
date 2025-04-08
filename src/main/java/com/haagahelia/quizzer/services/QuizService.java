package com.haagahelia.quizzer.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.repositories.QuizRepository;

@Service
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;

    public List<Quiz> getAllQuizzesByTeacher(Long teacherId) {
        
        List<Quiz> quizList = quizRepository.findAllByTeacher_TeacherId(teacherId);
        return quizList;
    }

}

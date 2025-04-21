package com.haagahelia.quizzer.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.haagahelia.quizzer.model.Choice;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.ChoiceRepository;
import com.haagahelia.quizzer.repositories.QuestionRepository;
import com.haagahelia.quizzer.repositories.QuizRepository;

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

    public Quiz addQuiz(Quiz quiz) {
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz data is not provided or is invalid.");
        }
        return quizRepository.save(quiz);
    }

    public Quiz editQuiz(Long quizId, Quiz updatedQuiz) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));
        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setDescription(updatedQuiz.getDescription());
        existingQuiz.setCourseCode(updatedQuiz.getCourseCode());
        existingQuiz.setPublishedStatus(updatedQuiz.isPublishedStatus());
        existingQuiz.setPublishedDate(updatedQuiz.getPublishedDate());
        return quizRepository.save(existingQuiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));
        List<Question> questions = quiz.getQuestions();
        List<Choice> choices = new ArrayList<>();
        for (Question question : questions) {
            choices.addAll(question.getChoices());
        }
        choiceRepository.deleteAllInBatch(choices);
        questionRepository.deleteAllInBatch(questions);
        quizRepository.deleteQuizById(quizId);
    }
}

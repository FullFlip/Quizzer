package com.haagahelia.quizzer.web;

import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.haagahelia.quizzer.model.Choice;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.ChoiceRepository;
import com.haagahelia.quizzer.repositories.QuestionRepository;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.services.QuizService;
import com.haagahelia.quizzer.services.TeacherService;

import jakarta.transaction.Transactional;

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

    @Autowired
    private ChoiceRepository choiceRepository;

    @GetMapping("/test")
    @ResponseBody
    public Stream<Teacher> testEndpoint() {
        return teacherService.findOnlyTeacherData();
    }

    // Mappings for Quizzes

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
    @GetMapping("/quizzes/{id}/questions")
    public Quiz getQuestionsForQuiz(@PathVariable Long id) {

        if (id == null) {
            throw new IllegalArgumentException("Id is not provided or is invalid.");
        }

        Quiz quiz = (Quiz) quizRepository.findById(id).orElseThrow();
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz with id " + id + " could not be found");
        }

        return quiz;
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
    @Transactional
    @DeleteMapping("/quizzes/{id}")
    public void deleteQuiz(@PathVariable Long id) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + id + " could not be found"));

        List<Question> questions = quiz.getQuestions();

        List<Choice> choices = new ArrayList<>();

        for (Question question : questions) {
            choices.addAll(question.getChoices());
        }
        
        choiceRepository.deleteAllInBatch(choices);
        questionRepository.deleteAllInBatch(questions);
        quizRepository.deleteQuizById(id);

        List<Quiz> quizs = quizRepository.findAll();
        System.out.println(quizs.size());

        System.out.println("Quiz with id " + id + " has been deleted.");
    }
    // Mappings for Question

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

    // Adding a question with choices
    // This method assumes that the Question object contains a list of Choice
    // objects
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/questions-with-choices")
    public Question addQuestionWithChoices(@RequestBody Question question, @RequestHeader("quizId") Long quizId) {
        if (question == null || question.getChoices() == null) {
            throw new IllegalArgumentException(
                    "Question, its choices, or associated quiz are not provided or are invalid.");
        }

        // Fetch the associated quiz from the database
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz with id " + quizId + " could not be found"));

        // Set the quiz for the question
        question.setQuiz(quiz);

        // Save the question first
        Question savedQuestion = questionRepository.save(question);

        // Save each choice and associate it with the saved question
        for (Choice choice : question.getChoices()) {
            choice.setQuestion(savedQuestion);
            choiceRepository.save(choice);
        }

        return savedQuestion;
    }

    // Mappings for Choice

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/choices")
    public Choice addChoice(@RequestBody Choice choice) {
        if (choice == null) {
            throw new IllegalArgumentException("Choice data is not provided or is invalid.");
        }
        return choiceRepository.save(choice);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/choices/{id}")
    public Choice editChoice(@PathVariable Long id, @RequestBody Choice updatedChoice) {
        Choice existingChoice = choiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Choice with id " + id + " could not be found"));
        existingChoice.setDescription(updatedChoice.getDescription());
        existingChoice.setTrue(updatedChoice.isTrue());
        return choiceRepository.save(existingChoice);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/choices/{id}")
    public void deleteChoice(@PathVariable Long id) {
        Choice choice = choiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Choice with id " + id + " could not be found"));
        choiceRepository.delete(choice);
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

    @GetMapping("/questions")
    @ResponseBody
    public List<Question> questions() {
        return questionRepository.findAll();
    }

}

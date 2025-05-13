package com.haagahelia.quizzer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.haagahelia.quizzer.model.Choice;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.repositories.TeacherRepository;

import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.Collections;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class TestiControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    void contextLoads() {
    }

    @BeforeEach
    void cleanUp() {
        quizRepository.deleteAll();
        teacherRepository.deleteAll();
    }

    @Test
    void getAllQuizzesReturnsEmptyListWhenNoQuizzesExist() {
        ResponseEntity<Object[]> response = restTemplate.getForEntity("/quizzes", Object[].class);
        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().length).isEqualTo(0);
    }

    @Test
    void getAllQuizzesReturnsListOfQuizzesWhenPublishedQuizzesExist() {

        Teacher teacher = new Teacher("testTeacher", "admin", null);
        teacherRepository.save(teacher);

        Quiz quiz1 = new Quiz("Published Quiz 1", "Description for Quiz 1", "test001", true, null, teacher);
        quizRepository.save(quiz1);

        Quiz quiz2 = new Quiz("Published Quiz 2", "Description for Quiz 2", "test002", true, null, teacher);
        quizRepository.save(quiz2);

        ResponseEntity<Quiz[]> response = restTemplate.getForEntity("/quizzes", Quiz[].class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().length).isEqualTo(2);

        assertThat(response.getBody()[0].getTitle()).isEqualTo("Published Quiz 1");
        assertThat(response.getBody()[1].getTitle()).isEqualTo("Published Quiz 2");
    }

    @Test
    void getPublishedQuizzesDoesNotReturnUnpublishedQuizzes() {

        Teacher teacher = new Teacher("testTeacher", "admin", null);
        teacherRepository.save(teacher);

        Quiz quiz1 = new Quiz("Published Quiz 1", "Description for Quiz 1", "test001", false, null, teacher);
        quizRepository.save(quiz1);

        Quiz quiz2 = new Quiz("Published Quiz 2", "Description for Quiz 2", "test002", true, null, teacher);
        quizRepository.save(quiz2);

        ResponseEntity<Quiz[]> response = restTemplate.getForEntity("/quizzes/published", Quiz[].class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().length).isEqualTo(1);

        assertThat(response.getBody()[0].getTitle()).isEqualTo("Published Quiz 2");
    }

    @Test
    void getQuestionsForQuizReturnsEmptyListWhenQuizDoesNotHaveQuestions() {
        Teacher teacher = new Teacher("testTeacher", "admin", null);
        teacherRepository.save(teacher);

        Quiz quiz = new Quiz("Quiz Without Questions", "This quiz has no questions.", "test003", true, null, teacher);
        quizRepository.save(quiz);

        ResponseEntity<Quiz> response = restTemplate.getForEntity("/quizzes/" + quiz.getId() + "/questions",
                Quiz.class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getQuestions()).isEqualTo(Collections.emptyList());
    }

    @Test
    void getQuestionsForQuizReturnsListOfQuestionsWhenQuizHasQuestions() {

        Quiz quiz = createQuiz();

        ResponseEntity<Quiz> response = restTemplate.getForEntity("/quizzes/" + quiz.getId() + "/questions",
                Quiz.class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getQuestions().size()).isEqualTo(2);

        assertThat(response.getBody().getQuestions().get(0).getTitle()).isEqualTo("What is 2 + 2?");
        assertThat(response.getBody().getQuestions().get(1).getTitle()).isEqualTo("What is the capital of France?");
    }

    @Test
    void getQuestionsForQuizReturnsErrorWhenQuizDoesNotExist() {
        Long nonExistentQuizId = 999L;
        ResponseEntity<String> response = restTemplate.getForEntity("/quizzes/" + nonExistentQuizId + "/questions",
                String.class);

        assertThat(response.getStatusCode().value()).isEqualTo(500);
    }

    private Quiz createQuiz() {

        Choice choice1 = new Choice(true, "4");
        Choice choice2 = new Choice(false, "3");

        Choice choice3 = new Choice(true, "Paris");
        Choice choice4 = new Choice(false, "London");

        Question question1 = new Question("What is 2 + 2?", "Easy", Arrays.asList(choice1, choice2));
        choice1.setQuestion(question1);
        choice2.setQuestion(question1);

        Question question2 = new Question("What is the capital of France?", "Easy", Arrays.asList(choice3, choice4));
        choice3.setQuestion(question2);
        choice4.setQuestion(question2);

        Teacher teacher = new Teacher("testTeacher", "admin", null);
        teacherRepository.save(teacher);

        Quiz quiz = new Quiz("Quiz With Questions and Options", "This quiz has questions and answer options.",
                "test005", true, Arrays.asList(question1, question2), teacher);
        question1.setQuiz(quiz);
        question2.setQuiz(quiz);

        quizRepository.save(quiz);

        return quiz;
    }

}

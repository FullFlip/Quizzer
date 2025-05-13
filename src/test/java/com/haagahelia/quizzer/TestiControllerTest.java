package com.haagahelia.quizzer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.QuizRepository;
import com.haagahelia.quizzer.repositories.TeacherRepository;

import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.context.annotation.Profile;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.assertj.core.api.Assertions.assertThat;

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
}

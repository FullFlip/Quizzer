package com.haagahelia.quizzer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
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
}

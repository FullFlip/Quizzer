package com.haagahelia.quizzer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class AnswerCreateEndpointTests {
    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private com.haagahelia.quizzer.repositories.TeacherRepository teacherRepository;

    @Autowired
    private com.haagahelia.quizzer.repositories.CategoryRepository categoryRepository; 
    @Test
    void createAnswerSavesAnswerForPublishedQuiz() {
        // Ensure a teacher exists
        var teacher = new com.haagahelia.quizzer.model.Teacher("Test Teacher", "test", null);
        teacherRepository.save(teacher);

        // Create and save a test category
        var category = new com.haagahelia.quizzer.model.Category();
        category.setTitle("Test Category");
        category.setDescription("A category for testing purposes");
        com.haagahelia.quizzer.model.Category savedCategory = categoryRepository.save(category);
        Long categoryId = savedCategory.getCategoryId();

        // 1. Create and save a published quiz with a question and an answer option
        // Create quiz
        var quiz = new com.haagahelia.quizzer.model.Quiz();
        quiz.setTitle("Test Quiz");
        quiz.setDescription("Test Description");
        quiz.setCourseCode("TEST101");
        quiz.setPublishedStatus(true);
        quiz.setPublishedDate(java.time.LocalDate.now());

        // Create question
        var question = new com.haagahelia.quizzer.model.Question();
        question.setTitle("What is 2+2?");
        question.setDifficulty("Easy");

        // Create choice
        var choice = new com.haagahelia.quizzer.model.Choice();
        choice.setDescription("4");
        choice.setTrue(true);

        // Link choice to question
        question.setChoices(java.util.List.of(choice));
        choice.setQuestion(question);

        // Link question to quiz
        quiz.setQuestions(java.util.List.of(question));
        question.setQuiz(quiz);

        // Save quiz (POST /quizzes)
        var quizDto = new java.util.HashMap<String, Object>();
        quizDto.put("title", quiz.getTitle());
        quizDto.put("description", quiz.getDescription());
        quizDto.put("courseCode", quiz.getCourseCode());
        quizDto.put("publishedStatus", quiz.isPublishedStatus());
        quizDto.put("publishedDate", quiz.getPublishedDate().toString());
        quizDto.put("categoryId", categoryId); // Use the saved category's ID
        quizDto.put("teacher", java.util.Map.of("teacherId", teacher.getTeacherId())); // updated to use saved teacher

        ResponseEntity<com.haagahelia.quizzer.model.Quiz> quizResponse = restTemplate.postForEntity("/quizzes", quizDto,
                com.haagahelia.quizzer.model.Quiz.class);

        assertThat(quizResponse.getStatusCode().is2xxSuccessful()).isTrue();
        Long quizId = quizResponse.getBody().getId();

        // Add question with choices (POST /questions-with-choices)
        var questionDto = new java.util.HashMap<String, Object>();
        questionDto.put("title", question.getTitle());
        questionDto.put("difficulty", question.getDifficulty());
        questionDto.put("choices", java.util.List.of(
                java.util.Map.of("description", choice.getDescription(), "true", true)));

        HttpHeaders headers = new HttpHeaders();
        headers.add("quizId", quizId.toString());
        HttpEntity<Object> request = new HttpEntity<>(questionDto, headers);

        ResponseEntity<com.haagahelia.quizzer.model.Question> questionResponse =
            restTemplate.postForEntity("/questions-with-choices", request, com.haagahelia.quizzer.model.Question.class);

        assertThat(questionResponse.getStatusCode().is2xxSuccessful()).isTrue();
        Long questionId = questionResponse.getBody().getId();
        Long choiceId = questionResponse.getBody().getChoices().get(0).getChoiceId();

        // 2. Submit an answer (POST /answers/{quizId})
        var answerDto = new java.util.HashMap<String, Object>();
        answerDto.put("answers", java.util.Map.of(questionId.toString(), choiceId.intValue()));
        answerDto.put("correctCount", 1);
        answerDto.put("totalQuestions", 1);

        ResponseEntity<String> answerResponse = restTemplate.postForEntity("/answers/" + quizId, answerDto,
                String.class);

        assertThat(answerResponse.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(answerResponse.getBody()).contains("Answers submitted successfully");

        // 3. Verify the answer is saved in the database
        ResponseEntity<com.haagahelia.quizzer.model.Answer[]> dbAnswers = restTemplate.getForEntity("/answers",
                com.haagahelia.quizzer.model.Answer[].class);

        assertThat(dbAnswers.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(dbAnswers.getBody()).isNotNull();
        assertThat(dbAnswers.getBody().length).isEqualTo(1);

        com.haagahelia.quizzer.model.Answer savedAnswer = dbAnswers.getBody()[0];
        assertThat(savedAnswer.getCorrectAnswers()).isEqualTo(1);
        assertThat(savedAnswer.getTotalAnswers()).isEqualTo(1);
    }
}

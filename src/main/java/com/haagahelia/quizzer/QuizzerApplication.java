package com.haagahelia.quizzer;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.haagahelia.quizzer.model.Choice;
import com.haagahelia.quizzer.model.Question;
import com.haagahelia.quizzer.model.Quiz;
import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.services.TeacherService;

@SpringBootApplication
public class QuizzerApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizzerApplication.class, args);
    }

    @Bean
    public CommandLineRunner demo(TeacherService teacherService) {
        return (args) -> {
            Choice mathChoice1 = new Choice(true, "1");
            Choice mathChoice2 = new Choice(false, "2");
            Choice mathChoice3 = new Choice(false, "0");

            Choice scienceChoice1 = new Choice(false, "H20");
            Choice scienceChoice2 = new Choice(false, "H2O2");
            Choice scienceChoice3 = new Choice(true, "D2O");

            Question mathQuestion = new Question("What is 1 + 0?", "Easy", Arrays.asList(mathChoice1, mathChoice2, mathChoice3));
            mathChoice1.setQuestion(mathQuestion);
            mathChoice2.setQuestion(mathQuestion);
            mathChoice3.setQuestion(mathQuestion);

            Question scienceQuestion = new Question("What is the Chemical formula of water?", "Easy", Arrays.asList(scienceChoice1, scienceChoice2, scienceChoice3));
            scienceChoice1.setQuestion(scienceQuestion);
            scienceChoice2.setQuestion(scienceQuestion);
            scienceChoice3.setQuestion(scienceQuestion);

            Quiz mathQuiz1 = new Quiz("Basic Math Quiz", "A series of basic math questions", "MATH101", false, Arrays.asList(mathQuestion));
            mathQuestion.setQuiz(mathQuiz1);

            Quiz scienceQuiz1 = new Quiz("Basic Science Quiz", "A series of basic science questions", "SCI101", false, Arrays.asList(scienceQuestion));
            scienceQuestion.setQuiz(scienceQuiz1);

            Quiz mathQuiz2 = new Quiz("Advanced Math Quiz", "A series of advanced math questions", "MATH201", false, null);
            Quiz scienceQuiz2 = new Quiz("Advanced Science Quiz", "A series of advanced science questions", "SCI201", false, null);

            Quiz mathQuiz3 = new Quiz("Geometry Quiz", "A quiz about geometry", "MATH301", false, null);
            Quiz scienceQuiz3 = new Quiz("Physics Quiz", "A quiz about physics", "SCI301", false, null);

            Teacher mathTeacher = new Teacher("John Doe", "Math Teacher", Arrays.asList(mathQuiz1, mathQuiz2, mathQuiz3));
            mathQuiz1.setTeacher(mathTeacher);
            mathQuiz2.setTeacher(mathTeacher);
            mathQuiz3.setTeacher(mathTeacher);

            Teacher scienceTeacher = new Teacher("Jane Smith", "Science Teacher", Arrays.asList(scienceQuiz1, scienceQuiz2, scienceQuiz3));
            scienceQuiz1.setTeacher(scienceTeacher);
            scienceQuiz2.setTeacher(scienceTeacher);
            scienceQuiz3.setTeacher(scienceTeacher);

            teacherService.addNewTeacher(mathTeacher);
            teacherService.addNewTeacher(scienceTeacher);

            teacherService.findAllTeachers().forEach(teacher -> {
                System.out.println(teacher);
            });
        };
    }
}

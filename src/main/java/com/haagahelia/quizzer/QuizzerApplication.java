package com.haagahelia.quizzer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.TeacherRepository;

@SpringBootApplication
public class QuizzerApplication {

        public static void main(String[] args) {
                SpringApplication.run(QuizzerApplication.class, args);
        }

        @Bean
        public CommandLineRunner initDatabase(@Autowired TeacherRepository teacherRepository) {
                return args -> {
                        if (teacherRepository.count() == 0) {
                                Teacher defaultTeacher = new Teacher("Default Teacher", "Admin");
                                teacherRepository.save(defaultTeacher);
                                System.out.println("Default teacher created: " + defaultTeacher);
                        }
                };
        }
}

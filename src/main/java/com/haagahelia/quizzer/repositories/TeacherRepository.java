package com.haagahelia.quizzer.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.haagahelia.quizzer.model.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}

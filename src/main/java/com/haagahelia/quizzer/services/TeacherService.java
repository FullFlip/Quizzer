package com.haagahelia.quizzer.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.haagahelia.quizzer.model.Teacher;
import com.haagahelia.quizzer.repositories.TeacherRepository;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    public Teacher findTeacherById(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public List<Teacher> findAllTeachers() {
        return teacherRepository.findAll();
    }

    public Stream<Teacher> findOnlyTeacherData() {
        return teacherRepository.findAll().stream().map(teacher -> 
           new Teacher(teacher.getTeacherId(), teacher.getName())
        );
    }

    public void addNewTeacher(Teacher teacher) {
        teacherRepository.save(teacher);
    }

    

}

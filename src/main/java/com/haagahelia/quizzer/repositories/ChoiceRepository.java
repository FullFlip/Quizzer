package com.haagahelia.quizzer.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.haagahelia.quizzer.model.Choice;

public interface ChoiceRepository extends JpaRepository<Choice, Long> {
    
}

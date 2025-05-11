package com.haagahelia.quizzer.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import com.haagahelia.quizzer.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}

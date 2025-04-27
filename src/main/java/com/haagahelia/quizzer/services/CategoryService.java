package com.haagahelia.quizzer.services;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.haagahelia.quizzer.model.Category;
import com.haagahelia.quizzer.repositories.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Add a new category
    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }


}
package com.haagahelia.quizzer.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;



    @Controller
public class FallbackController {

    // Handle GET for root
    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }
    
    
    // Handle GET for one-level paths without a dot
    @GetMapping("/{path:[^\\.]+}")
    public String oneLevelFallback() {
        return "forward:/index.html";
    }
    
    // (Optional) Handle GET for two-level paths without a dot
    @GetMapping("/{path1:[^\\.]+}/{path2:[^\\.]+}")
    public String twoLevelFallback() {
        return "forward:/index.html";
    }
}
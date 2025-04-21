package com.haagahelia.quizzer.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class FallbackController {

    // Forward the root URL to index.html
    @RequestMapping("/")
    public String root() {
        return "forward:/index.html";
    }
    
    // Forward any one-level path that does NOT contain a period
    @RequestMapping("/{path:[^\\.]+}")
    public String oneLevelFallback() {
        return "forward:/index.html";
    }
}
package com.haagahelia.quizzer.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class quizcontroller {
    
    @GetMapping("/test")
    @ResponseBody
    public String testEndpoint() {
        return "This is a test endpoint!";
    }
    @GetMapping("/matti")
    @ResponseBody
    public String mattiEndpoint() {
        return "Matin oma endpoint ";
    }
    
}

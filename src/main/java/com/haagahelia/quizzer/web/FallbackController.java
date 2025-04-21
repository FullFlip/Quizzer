package com.haagahelia.quizzer.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class FallbackController {

    // Catch root and any paths without a file extension
    @RequestMapping(value = { "/", "/{path:[^\\.]*}", "/**/{path:^(?!.*\\.).*$}" })
    public String fallback() {
        return "forward:/index.html";
    }
}
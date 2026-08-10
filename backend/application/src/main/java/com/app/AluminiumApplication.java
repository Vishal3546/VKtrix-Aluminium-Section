package com.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AluminiumApplication {

    public static void main(String[] args) {
        org.springframework.context.ApplicationContext ctx = SpringApplication.run(AluminiumApplication.class, args);
        System.out.println("================ REGISTERED BEANS ================");
        for (String beanName : ctx.getBeanDefinitionNames()) {
            if (beanName.toLowerCase().contains("party") || beanName.toLowerCase().contains("profile")) {
                System.out.println("FOUND BEAN: " + beanName);
            }
        }
        System.out.println("==================================================");
    }
}

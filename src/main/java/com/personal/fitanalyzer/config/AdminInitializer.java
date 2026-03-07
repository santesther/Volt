package com.personal.fitanalyzer.config;

import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.enums.Goal;
import com.personal.fitanalyzer.domain.enums.Role;
import com.personal.fitanalyzer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setAge(100);
            admin.setPassword_confirmation(passwordEncoder.encode(adminPassword));
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setGender("F");
            admin.setWeight(60.0F);
            admin.setHeight(1.65F);
            admin.setRole(Role.ADMIN);
            admin.setGoal(Goal.FITNESS);

            userRepository.save(admin);
        }
    }
}
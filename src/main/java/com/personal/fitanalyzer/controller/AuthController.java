package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.dto.AuthRequestDTO;
import com.personal.fitanalyzer.dto.AuthResponseDTO;
import com.personal.fitanalyzer.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticateUser(@RequestBody AuthRequestDTO authRequest) {
        return ResponseEntity.ok(authService.authenticateUser(authRequest));
    }
}
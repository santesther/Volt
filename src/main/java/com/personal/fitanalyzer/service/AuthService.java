package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.dto.AuthRequestDTO;
import com.personal.fitanalyzer.dto.AuthResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;

    public AuthResponseDTO authenticateUser(AuthRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));

        if(authentication.isAuthenticated()){
            String token = jwtService.generateToken(
                    customUserDetailsService.loadUserByUsername(loginRequest.email()));
            return new AuthResponseDTO(token);
        } else {
            throw new UsernameNotFoundException("Credenciais inválidas");
        }
    }
}
package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.dto.SuggestionRequestDTO;
import com.personal.fitanalyzer.dto.SuggestionResponseDTO;
import com.personal.fitanalyzer.service.SuggestionEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/suggestions")
@RequiredArgsConstructor
public class SuggestionController {

    private final SuggestionEngineService suggestionEngineService;

    @PostMapping("/{userId}")
    public ResponseEntity<SuggestionResponseDTO> getSuggestion(
            @PathVariable Long userId,
            @RequestBody SuggestionRequestDTO request) {
        return ResponseEntity.ok(suggestionEngineService.getSuggestion(userId, request));
    }
}
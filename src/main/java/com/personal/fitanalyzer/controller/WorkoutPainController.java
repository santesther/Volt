package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.dto.WorkoutPainRequestDTO;
import com.personal.fitanalyzer.service.WorkoutPainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/workouts")
@RequiredArgsConstructor
public class WorkoutPainController {

    private final WorkoutPainService workoutPainService;

    @PatchMapping("/{id}/pain")
    public ResponseEntity<Void> savePain(
            @PathVariable Long id,
            @RequestBody WorkoutPainRequestDTO request) {
        workoutPainService.savePain(id, request);
        return ResponseEntity.noContent().build();
    }
}
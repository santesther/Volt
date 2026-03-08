package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.dto.TrainingPlanRequestDTO;
import com.personal.fitanalyzer.dto.TrainingPlanResponseDTO;
import com.personal.fitanalyzer.service.TrainingPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/training-plans")
@RequiredArgsConstructor
public class TrainingPlanController {

    private final TrainingPlanService trainingPlanService;

    @PostMapping
    public ResponseEntity<TrainingPlanResponseDTO> createOrUpdate(@Valid @RequestBody TrainingPlanRequestDTO request) {
        return new ResponseEntity<>(trainingPlanService.createOrUpdate(request), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<TrainingPlanResponseDTO> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(trainingPlanService.findByUserId(userId));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteByUserId(@PathVariable Long userId) {
        trainingPlanService.deleteByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}

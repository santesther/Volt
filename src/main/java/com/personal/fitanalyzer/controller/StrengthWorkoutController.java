package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.domain.StrengthWorkout;
import com.personal.fitanalyzer.dto.StrengthWorkoutRequestDTO;
import com.personal.fitanalyzer.dto.StrengthWorkoutResponseDTO;
import com.personal.fitanalyzer.service.StrengthWorkoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/strength-workouts")
public class StrengthWorkoutController {

    private final StrengthWorkoutService strengthWorkoutService;

    public StrengthWorkoutController(StrengthWorkoutService strengthWorkoutService) {
        this.strengthWorkoutService = strengthWorkoutService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<StrengthWorkoutResponseDTO> findById(@PathVariable Long id) {
        StrengthWorkout workout = strengthWorkoutService.findStrengthWorkoutById(id);
        return ResponseEntity.ok(strengthWorkoutService.toResponse(workout));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StrengthWorkoutResponseDTO>> findByUserId(@PathVariable Long userId) {
        List<StrengthWorkout> workouts = strengthWorkoutService.findStrengthWorkoutByUserId(userId);
        return ResponseEntity.ok(workouts.stream()
                .map(strengthWorkoutService::toResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<StrengthWorkoutResponseDTO> create(@Valid @RequestBody StrengthWorkoutRequestDTO strengthWorkoutRequest) {
        StrengthWorkoutResponseDTO createdStrengthWorkout = strengthWorkoutService.createStrengthWorkout(strengthWorkoutRequest);
        return new ResponseEntity<>(createdStrengthWorkout, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StrengthWorkoutResponseDTO>> findAll() {
        return ResponseEntity.ok(strengthWorkoutService.findAllStrengthWorkouts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StrengthWorkoutResponseDTO> update(@PathVariable Long id, @RequestBody StrengthWorkoutRequestDTO strengthWorkoutRequest) {
        StrengthWorkoutResponseDTO updatedStrengthWorkout = strengthWorkoutService.updateStrengthWorkout(id, strengthWorkoutRequest);
        return ResponseEntity.ok(updatedStrengthWorkout);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        strengthWorkoutService.deleteStrengthWorkout(id);
        return ResponseEntity.noContent().build();
    }
}

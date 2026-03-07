package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.dto.ExerciseRequestDTO;
import com.personal.fitanalyzer.dto.ExerciseResponseDTO;
import com.personal.fitanalyzer.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<ExerciseResponseDTO>> findAll() {
        return ResponseEntity.ok(exerciseService.findAllExercises());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.findExerciseById(id));
    }

    @GetMapping("/muscle-group/{muscleGroupId}")
    public ResponseEntity<List<ExerciseResponseDTO>> findByMuscleGroup(@PathVariable Long muscleGroupId) {
        return ResponseEntity.ok(exerciseService.findByMuscleGroupId(muscleGroupId));
    }

    @PostMapping
    public ResponseEntity<ExerciseResponseDTO> create(@Valid @RequestBody ExerciseRequestDTO request) {
        return new ResponseEntity<>(exerciseService.createExercise(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ExerciseRequestDTO request) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }
}

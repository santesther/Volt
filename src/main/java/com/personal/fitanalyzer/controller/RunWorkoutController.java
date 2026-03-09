package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.domain.RunWorkout;
import com.personal.fitanalyzer.dto.RunWorkoutRequestDTO;
import com.personal.fitanalyzer.dto.RunWorkoutResponseDTO;
import com.personal.fitanalyzer.service.RunWorkoutService;
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
@RequestMapping("run-workouts")
public class RunWorkoutController {

    private final RunWorkoutService runWorkoutService;

    public RunWorkoutController(RunWorkoutService runWorkoutService) {
        this.runWorkoutService = runWorkoutService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<RunWorkoutResponseDTO> findById(@PathVariable Long id) {
        RunWorkout runWorkout = runWorkoutService.findRunWorkoutById(id);
        return ResponseEntity.ok(new RunWorkoutResponseDTO(runWorkout.getId(), runWorkout.getEffort(), runWorkout.getDate(), runWorkout.getKm(),
                runWorkout.getDuration(), runWorkout.getZone(), runWorkout.getPace(), runWorkout.getUphill(), runWorkout.getDownhill(), runWorkout.getClimate()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RunWorkoutResponseDTO>> findByUserId(@PathVariable Long userId) {
        List<RunWorkout> workouts = runWorkoutService.findRunWorkoutByUserId(userId);
        return ResponseEntity.ok(workouts.stream()
                .map(w -> new RunWorkoutResponseDTO(w.getId(), w.getEffort(), w.getDate(), w.getKm(),
                        w.getDuration(), w.getZone(), w.getPace(), w.getUphill(), w.getDownhill(), w.getClimate()))
                .collect(java.util.stream.Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<RunWorkoutResponseDTO> create(@Valid @RequestBody RunWorkoutRequestDTO runWorkoutRequest) {
        RunWorkoutResponseDTO createdRunWorkout = runWorkoutService.createRunWorkout(runWorkoutRequest);
        return new ResponseEntity<>(createdRunWorkout, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RunWorkoutResponseDTO>> findAll() {
        return ResponseEntity.ok(runWorkoutService.findAllRunWorkouts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RunWorkoutResponseDTO> update(@PathVariable Long id, @RequestBody RunWorkoutRequestDTO runWorkoutRequest) {
        RunWorkoutResponseDTO updatedRunWorkout = runWorkoutService.updateRunWorkout(id, runWorkoutRequest);
        return ResponseEntity.ok(updatedRunWorkout);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        runWorkoutService.deleteRunWorkout(id);
        return ResponseEntity.noContent().build();
    }
}

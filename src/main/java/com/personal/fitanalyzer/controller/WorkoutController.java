package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.Workout;
import com.personal.fitanalyzer.dto.UserRequestDTO;
import com.personal.fitanalyzer.dto.UserResponseDTO;
import com.personal.fitanalyzer.dto.WorkoutRequestDTO;
import com.personal.fitanalyzer.dto.WorkoutResponseDTO;
import com.personal.fitanalyzer.service.UserService;
import com.personal.fitanalyzer.service.WorkoutService;
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
@RequestMapping("/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponseDTO> findById(@PathVariable Long id) {
        Workout workout = workoutService.findWorkoutById(id);
        return ResponseEntity.ok(new WorkoutResponseDTO(workout.getId(), workout.getEffort(), workout.getDate()));
    }

    @PostMapping
    public ResponseEntity<WorkoutResponseDTO> create(@Valid @RequestBody WorkoutRequestDTO workoutRequest) {
        WorkoutResponseDTO createdWorkout = workoutService.createWorkout(workoutRequest);
        return new ResponseEntity<>(createdWorkout, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WorkoutResponseDTO>> findAll() {
        return ResponseEntity.ok(workoutService.findAllWorkouts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponseDTO> update(@PathVariable Long id, @RequestBody WorkoutRequestDTO workoutRequest) {
        WorkoutResponseDTO updatedWorkout = workoutService.updateWorkout(id, workoutRequest);
        return ResponseEntity.ok(updatedWorkout);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}

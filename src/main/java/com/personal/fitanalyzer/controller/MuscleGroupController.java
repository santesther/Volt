package com.personal.fitanalyzer.controller;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.StrengthWorkout;
import com.personal.fitanalyzer.dto.MuscleGroupRequestDTO;
import com.personal.fitanalyzer.dto.MuscleGroupResponseDTO;
import com.personal.fitanalyzer.dto.StrengthWorkoutRequestDTO;
import com.personal.fitanalyzer.dto.StrengthWorkoutResponseDTO;
import com.personal.fitanalyzer.service.MuscleGroupService;
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
@RequestMapping("/muscle-groups")
public class MuscleGroupController {

    private final MuscleGroupService muscleGroupService;

    public MuscleGroupController(MuscleGroupService muscleGroupService) {
        this.muscleGroupService = muscleGroupService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MuscleGroupResponseDTO> findById(@PathVariable Long id) {
        MuscleGroups muscleGroups = muscleGroupService.findMuscleGroupsById(id);
        return ResponseEntity.ok(new MuscleGroupResponseDTO(muscleGroups.getId(), muscleGroups.getName(), muscleGroups.getRecoveryHours(), muscleGroups.getSize(),
                muscleGroups.getAntagonist()));
    }

    @PostMapping
    public ResponseEntity<MuscleGroupResponseDTO> create(@Valid @RequestBody MuscleGroupRequestDTO muscleGrouptRequest) {
        MuscleGroupResponseDTO createdMuscleGroup = muscleGroupService.createMuscleGroup(muscleGrouptRequest);
        return new ResponseEntity<>(createdMuscleGroup, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MuscleGroupResponseDTO>> findAll() {
        return ResponseEntity.ok(muscleGroupService.findAllMuscleGroups());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MuscleGroupResponseDTO> update(@PathVariable Long id, @RequestBody MuscleGroupRequestDTO muscleGroupRequest) {
        MuscleGroupResponseDTO updatedMuscleGroup = muscleGroupService.updateMuscleGroup(id, muscleGroupRequest);
        return ResponseEntity.ok(updatedMuscleGroup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        muscleGroupService.deleteMuscleGroup(id);
        return ResponseEntity.noContent().build();
    }
}

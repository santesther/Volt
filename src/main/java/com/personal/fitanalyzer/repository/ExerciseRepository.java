package com.personal.fitanalyzer.repository;

import com.personal.fitanalyzer.domain.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByMuscleGroupId(Long muscleGroupId);
    boolean existsByNameAndMuscleGroupId(String name, Long muscleGroupId);
}

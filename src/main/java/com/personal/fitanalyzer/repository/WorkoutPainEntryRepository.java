package com.personal.fitanalyzer.repository;

import com.personal.fitanalyzer.domain.WorkoutPainEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkoutPainEntryRepository extends JpaRepository<WorkoutPainEntry, Long> {

    List<WorkoutPainEntry> findByWorkoutId(Long workoutId);

    void deleteByWorkoutId(Long workoutId);

    @Query("SELECT p FROM WorkoutPainEntry p WHERE p.workout.user.id = :userId")
    List<WorkoutPainEntry> findByUserId(@Param("userId") Long userId);
}
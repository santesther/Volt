package com.personal.fitanalyzer.repository;

import com.personal.fitanalyzer.domain.StrengthWorkout;
import com.personal.fitanalyzer.domain.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StrengthWorkoutRepository extends JpaRepository<StrengthWorkout, Long> {
    List<StrengthWorkout> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}

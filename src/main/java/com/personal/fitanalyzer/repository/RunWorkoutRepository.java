package com.personal.fitanalyzer.repository;

import com.personal.fitanalyzer.domain.RunWorkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RunWorkoutRepository extends JpaRepository<RunWorkout, Long> {
    List<RunWorkout> findByUserId(Long userid);
}

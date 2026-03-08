package com.personal.fitanalyzer.repository;

import com.personal.fitanalyzer.domain.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Long> {
    Optional<TrainingPlan> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
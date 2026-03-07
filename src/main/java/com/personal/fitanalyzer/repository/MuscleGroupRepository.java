package com.personal.fitanalyzer.repository;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.StrengthWorkout;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MuscleGroupRepository extends JpaRepository<MuscleGroups, Long> {
    boolean existsByName(String name);
    Optional<MuscleGroups> findByName(String name);
}

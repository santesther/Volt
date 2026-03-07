package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.Workout;
import com.personal.fitanalyzer.domain.enums.RunType;
import com.personal.fitanalyzer.domain.enums.Weather;
import com.personal.fitanalyzer.domain.enums.WorkoutType;
import com.personal.fitanalyzer.domain.enums.Zone;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


public record SuggestionResponseDTO(
        WorkoutType type,
        String message,
        List<MuscleGroups> suggestedMuscles,
        Integer suggestedSets,
        Zone suggestedZone,
        Float suggestedKm,
        RunType runType,
        String intensity,
        Map<String, Float> muscleFatigue
) {}
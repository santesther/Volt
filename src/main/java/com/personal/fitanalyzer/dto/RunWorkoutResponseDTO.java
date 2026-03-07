package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Weather;
import com.personal.fitanalyzer.domain.enums.Zone;

import java.time.LocalDateTime;


public record RunWorkoutResponseDTO(
        Long id,
        Integer effort,
        LocalDateTime date,
        Float km,
        Float duration,
        Zone zone,
        Float pace,
        Integer uphill,
        Integer downhill,
        Weather weather)
{}
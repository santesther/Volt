package com.personal.fitanalyzer.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "workout_pain_entry")
public class WorkoutPainEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @ManyToOne
    @JoinColumn(name = "muscle_group_id", nullable = false)
    private MuscleGroups muscleGroup;

    private Integer painIntensity;

    public WorkoutPainEntry() {}

    public WorkoutPainEntry(Workout workout, MuscleGroups muscleGroup, Integer painIntensity) {
        this.workout = workout;
        this.muscleGroup = muscleGroup;
        this.painIntensity = painIntensity;
    }

    public Long getId() { return id; }
    public Workout getWorkout() { return workout; }
    public void setWorkout(Workout workout) { this.workout = workout; }
    public MuscleGroups getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(MuscleGroups muscleGroup) { this.muscleGroup = muscleGroup; }
    public Integer getPainIntensity() { return painIntensity; }
    public void setPainIntensity(Integer painIntensity) { this.painIntensity = painIntensity; }
}
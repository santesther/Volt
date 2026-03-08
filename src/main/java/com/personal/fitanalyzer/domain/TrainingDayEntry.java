package com.personal.fitanalyzer.domain;

import com.personal.fitanalyzer.domain.enums.WorkoutType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="training_day_entry")
public class TrainingDayEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private WorkoutType workoutType;
    @ManyToMany
    @JoinTable(
            name = "training_day_entry_muscle_groups",
            joinColumns = @JoinColumn(name = "training_day_entry_id"),
            inverseJoinColumns = @JoinColumn(name = "muscle_group_id")
    )
    private List<MuscleGroups> muscleGroups = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "training_day_id")
    private TrainingDay trainingDay;

    public TrainingDayEntry(){
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WorkoutType getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(WorkoutType workoutType) {
        this.workoutType = workoutType;
    }

    public List<MuscleGroups> getMuscleGroups() {
        return muscleGroups;
    }

    public void setMuscleGroups(List<MuscleGroups> muscleGroups) {
        this.muscleGroups = muscleGroups;
    }

    public TrainingDay getTrainingDay() {
        return trainingDay;
    }

    public void setTrainingDay(TrainingDay trainingDay) {
        this.trainingDay = trainingDay;
    }
}

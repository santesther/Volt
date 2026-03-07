package com.personal.fitanalyzer.domain;

import com.personal.fitanalyzer.domain.enums.Equipment;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "strength_workout")
@DiscriminatorValue("STRENGTH")
public class StrengthWorkout extends Workout {
    private Integer durationMinutes;
    private Equipment equipmentType;
    @OneToMany(mappedBy = "strengthWorkout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutSet> sets = new ArrayList<>();
    @ManyToMany
    @JoinTable(
            name = "strength_workout_muscle_groups",
            joinColumns = @JoinColumn(name = "strength_workout_id"),
            inverseJoinColumns = @JoinColumn(name = "muscle_group_id")
    )
    private List<MuscleGroups> muscles = new ArrayList<>();

    public StrengthWorkout(){
    }

    public StrengthWorkout(Long id, Integer effort, LocalDateTime date, Integer durationMinutes, Equipment equipmentType, List<WorkoutSet> sets, List<MuscleGroups> muscles) {
        super(id, effort, date);
        this.durationMinutes = durationMinutes;
        this.equipmentType = equipmentType;
        this.sets = sets;
        this.muscles = muscles;
    }

    public List<WorkoutSet> getSets() {
        return sets;
    }

    public void setSets(List<WorkoutSet> sets) {
        this.sets = sets;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Equipment getEquipmentType() {
        return equipmentType;
    }

    public void setEquipmentType(Equipment equipmentType) {
        this.equipmentType = equipmentType;
    }

    public List<MuscleGroups> getMuscles() {
        return muscles;
    }

    public void setMuscles(List<MuscleGroups> muscles) {
        this.muscles = muscles;
    }
}

package com.personal.fitanalyzer.domain;

import com.personal.fitanalyzer.domain.enums.Equipment;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "strength_workout")
@DiscriminatorValue("STRENGTH")
public class StrengthWorkout extends Workout {
    private Integer sets;
    private Integer durationMinutes;
    private Equipment equipmentType;
    @ManyToMany
    @JoinTable(
            name = "strength_workout_muscle_groups",
            joinColumns = @JoinColumn(name = "strength_workout_id"),
            inverseJoinColumns = @JoinColumn(name = "muscle_group_id")
    )
    private List<MuscleGroups> muscles;

    public StrengthWorkout(){
    }

    public StrengthWorkout(Long id, Integer effort, LocalDateTime date, Integer sets, Integer durationMinutes, Equipment equipmentType, List<MuscleGroups> muscles) {
        super(id, effort, date);
        this.sets = sets;
        this.durationMinutes = durationMinutes;
        this.equipmentType = equipmentType;
        this.muscles = muscles;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
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

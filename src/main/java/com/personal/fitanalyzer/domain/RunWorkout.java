package com.personal.fitanalyzer.domain;

import com.personal.fitanalyzer.domain.enums.Weather;
import com.personal.fitanalyzer.domain.enums.Zone;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "run_workout")
@DiscriminatorValue("RUN")
public class RunWorkout extends Workout {
    private Float km;
    private Float duration;
    private Float pace;
    private Zone zone;
    private Integer uphill;
    private Integer downhill;
    private Weather climate;
    @ManyToMany
    @JoinTable(
            name = "run_workout_painful_muscles",
            joinColumns = @JoinColumn(name = "run_workout_id"),
            inverseJoinColumns = @JoinColumn(name = "muscle_group_id")
    )
    private List<MuscleGroups> painfulMuscles = new ArrayList<>();

    public List<MuscleGroups> getPainfulMuscles() { return painfulMuscles; }
    public void setPainfulMuscles(List<MuscleGroups> m) { this.painfulMuscles = m; }

    public RunWorkout(){
    }

    public RunWorkout(Long id, Integer effort, LocalDateTime date, Float km, Float duration, Float pace, Zone zone, Integer uphill, Integer downhill, Weather climate) {
        super(id, effort, date);
        this.km = km;
        this.duration = duration;
        this.pace = pace;
        this.zone = zone;
        this.uphill = uphill;
        this.downhill = downhill;
        this.climate = climate;
    }

    public Float getKm() {
        return km;
    }

    public void setKm(Float km) {
        this.km = km;
    }

    public Float getDuration() {
        return duration;
    }

    public void setDuration(Float duration) {
        this.duration = duration;
    }

    public Float getPace() {
        return pace;
    }

    public void setPace(Float pace) {
        this.pace = pace;
    }

    public Zone getZone() {
        return zone;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
    }

    public Integer getUphill() {
        return uphill;
    }

    public void setUphill(Integer uphill) {
        this.uphill = uphill;
    }

    public Integer getDownhill() {
        return downhill;
    }

    public void setDownhill(Integer downhill) {
        this.downhill = downhill;
    }

    public Weather getClimate() {
        return climate;
    }

    public void setClimate(Weather climate) {
        this.climate = climate;
    }
}

package com.personal.fitanalyzer.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="training_day")
public class TrainingDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private DayOfWeek dayOfWeek;
    @OneToMany(mappedBy = "trainingDay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrainingDayEntry> trainingDayEntries = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "training_plan_id")
    private TrainingPlan trainingPlan;

    public TrainingDay(){
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public List<TrainingDayEntry> getTrainingDayEntries() {
        return trainingDayEntries;
    }

    public void setTrainingDayEntries(List<TrainingDayEntry> trainingDayEntries) {
        this.trainingDayEntries = trainingDayEntries;
    }

    public TrainingPlan getTrainingPlan() {
        return trainingPlan;
    }

    public void setTrainingPlan(TrainingPlan trainingPlan) {
        this.trainingPlan = trainingPlan;
    }
}

package com.personal.fitanalyzer.domain;

import com.personal.fitanalyzer.domain.enums.Size;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "muscle_groups")
public class MuscleGroups {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Float recoveryHours;
    private Size size;
    @ManyToOne
    @JoinColumn(name = "antagonist_id")
    private MuscleGroups antagonist;

    public MuscleGroups(){
    }

    public MuscleGroups(Long id, String name, Float recoveryHours, Size size, MuscleGroups antagonist) {
        this.id = id;
        this.name = name;
        this.recoveryHours = recoveryHours;
        this.size = size;
        this.antagonist = antagonist;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getRecoveryHours() {
        return recoveryHours;
    }

    public void setRecoveryHours(Float recoveryHours) {
        this.recoveryHours = recoveryHours;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public MuscleGroups getAntagonist() {
        return antagonist;
    }

    public void setAntagonist(MuscleGroups antagonist) {
        this.antagonist = antagonist;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MuscleGroups)) return false;
        MuscleGroups that = (MuscleGroups) o;
        return java.util.Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id);
    }
}

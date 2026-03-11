package com.personal.fitanalyzer.domain;

import com.personal.fitanalyzer.domain.enums.Goal;
import com.personal.fitanalyzer.domain.enums.Role;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.Period;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private Float height;

    @Column(nullable = false)
    private Float weight;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    @Size(min=8)
    private String password;

    @Column(nullable = false)
    @Size(min=8)
    private String password_confirmation;

    @Column(nullable = false)
    private Goal goal;

    private Role role;

    @Column(name = "profile_picture", columnDefinition = "bytea")
    private byte[] profilePicture;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Workout> workouts;

    public User() {}

    public User(Long id, String name, String email, Float height, Float weight, LocalDate dateOfBirth, String gender, String password, String password_confirmation, Goal goal, Role role, List<Workout> workouts) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.height = height;
        this.weight = weight;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.goal = goal;
        this.role = role;
        this.workouts = workouts;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Float getHeight() { return height; }
    public void setHeight(Float height) { this.height = height; }

    public Float getWeight() { return weight; }
    public void setWeight(Float weight) { this.weight = weight; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPassword_confirmation() { return password_confirmation; }
    public void setPassword_confirmation(String password_confirmation) { this.password_confirmation = password_confirmation; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Goal getGoal() { return goal; }
    public void setGoal(Goal goal) { this.goal = goal; }

    public byte[] getProfilePicture() { return profilePicture; }
    public void setProfilePicture(byte[] profilePicture) { this.profilePicture = profilePicture; }

    public List<Workout> getWorkouts() { return workouts; }
    public void setWorkouts(List<Workout> workouts) { this.workouts = workouts; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) return List.of();
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public Integer getAge() {
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}
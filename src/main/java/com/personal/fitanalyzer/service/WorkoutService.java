package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.Workout;
import com.personal.fitanalyzer.dto.WorkoutRequestDTO;
import com.personal.fitanalyzer.dto.WorkoutResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.UserRepository;
import com.personal.fitanalyzer.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    private final UserRepository userRepository;

    public WorkoutService(WorkoutRepository workoutRepository, UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public WorkoutResponseDTO createWorkout(WorkoutRequestDTO workoutRequest) {
        Workout workout = toEntity(workoutRequest);          // converte DTO → entidade
        Workout savedWorkout = workoutRepository.save(workout);

        return new WorkoutResponseDTO(                 // converte entidade → ResponseDTO e retorna
                savedWorkout.getId(),
                savedWorkout.getEffort(),
                savedWorkout.getDate()
        );
    }

    public List<WorkoutResponseDTO> findAllWorkouts() {
        return workoutRepository.findAll().stream()
                .map(workout -> new WorkoutResponseDTO(workout.getId(), workout.getEffort(), workout.getDate()))
                .collect(Collectors.toList());
    }

    public Workout findWorkoutById(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treino não encontrado"));
    }

    public List<Workout> findWorkoutByUserId(Long Userid) {
        return workoutRepository.findByUserId(Userid);
    }

    @Transactional
    public WorkoutResponseDTO updateWorkout(Long id, WorkoutRequestDTO workoutRequest) {
        Workout workout = findWorkoutById(id);
        workout.setEffort(workoutRequest.effort());
        workout.setDate(workoutRequest.date());

        Workout savedWorkout = workoutRepository.save(workout); // salva as alterações

        return new WorkoutResponseDTO(                 // retorna o ResponseDTO
                savedWorkout.getId(),
                savedWorkout.getEffort(),
                savedWorkout.getDate()
        );
    }

    @Transactional
    public void deleteWorkout(Long id) {
        if (!workoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Treino não encontrado");
        }
        workoutRepository.deleteById(id);
    }

    private Workout toEntity(WorkoutRequestDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        Workout workout = new Workout();
        workout.setEffort(dto.effort());
        workout.setDate(dto.date());
        workout.setUser(user);
        return workout;
    }
}

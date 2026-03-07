package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.StrengthWorkout;
import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.Workout;
import com.personal.fitanalyzer.dto.StrengthWorkoutRequestDTO;
import com.personal.fitanalyzer.dto.StrengthWorkoutResponseDTO;
import com.personal.fitanalyzer.dto.WorkoutRequestDTO;
import com.personal.fitanalyzer.dto.WorkoutResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.MuscleGroupRepository;
import com.personal.fitanalyzer.repository.StrengthWorkoutRepository;
import com.personal.fitanalyzer.repository.UserRepository;
import com.personal.fitanalyzer.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StrengthWorkoutService {

    private final StrengthWorkoutRepository strengthWorkoutRepository;

    private final WorkoutRepository workoutRepository;

    private final MuscleGroupRepository muscleGroups;

    private final UserRepository userRepository;

    public StrengthWorkoutService(WorkoutRepository workoutRepository, UserRepository userRepository, StrengthWorkoutRepository strengthWorkoutRepository, MuscleGroupRepository muscleGroups) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.strengthWorkoutRepository = strengthWorkoutRepository;
        this.muscleGroups = muscleGroups;
    }

    @Transactional
    public StrengthWorkoutResponseDTO createStrengthWorkout(StrengthWorkoutRequestDTO strengthWorkoutRequest) {
        StrengthWorkout strengthWorkout = toEntity(strengthWorkoutRequest);          // converte DTO → entidade
        StrengthWorkout savedStrengthWorkout = strengthWorkoutRepository.save(strengthWorkout);

        return new StrengthWorkoutResponseDTO(                 // converte entidade → ResponseDTO e retorna
                savedStrengthWorkout.getId(),
                savedStrengthWorkout.getEffort(),
                savedStrengthWorkout.getDate(),
                savedStrengthWorkout.getSets(),
                savedStrengthWorkout.getDurationMinutes(),
                savedStrengthWorkout.getEquipmentType(),
                savedStrengthWorkout.getMuscles()
        );
    }

    public List<StrengthWorkoutResponseDTO> findAllStrengthWorkouts() {
        return strengthWorkoutRepository.findAll().stream()
                .map(strengthWorkout -> new StrengthWorkoutResponseDTO(strengthWorkout.getId(), strengthWorkout.getEffort(), strengthWorkout.getDate(), strengthWorkout.getSets(), strengthWorkout.getDurationMinutes(), strengthWorkout.getEquipmentType(), strengthWorkout.getMuscles()))
                .collect(Collectors.toList());
    }

    public StrengthWorkout findStrengthWorkoutById(Long id) {
        return strengthWorkoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treino de musculação não encontrado"));
    }

    public List<StrengthWorkout> findStrengthWorkoutByUserId(Long Userid) {
        return strengthWorkoutRepository.findByUserId(Userid);
    }

    @Transactional
    public StrengthWorkoutResponseDTO updateStrengthWorkout(Long id, StrengthWorkoutRequestDTO strengthWorkoutRequest) {
        StrengthWorkout strengthWorkout = findStrengthWorkoutById(id);
        strengthWorkout.setEffort(strengthWorkoutRequest.effort());
        strengthWorkout.setDate(strengthWorkoutRequest.date());
        strengthWorkout.setSets(strengthWorkoutRequest.sets());
        strengthWorkout.setDurationMinutes(strengthWorkoutRequest.durationMinutes());
        strengthWorkout.setEquipmentType(strengthWorkoutRequest.equipment());
        List<MuscleGroups> muscles = muscleGroups.findAllById(strengthWorkoutRequest.muscleGroupsIds());
        strengthWorkout.setMuscles(muscles);

        StrengthWorkout savedStrengthWorkout = strengthWorkoutRepository.save(strengthWorkout); // salva as alterações

        return new StrengthWorkoutResponseDTO(                 // retorna o ResponseDTO
                savedStrengthWorkout.getId(),
                savedStrengthWorkout.getEffort(),
                savedStrengthWorkout.getDate(),
                savedStrengthWorkout.getSets(),
                savedStrengthWorkout.getDurationMinutes(),
                savedStrengthWorkout.getEquipmentType(),
                savedStrengthWorkout.getMuscles()
        );
    }

    @Transactional
    public void deleteStrengthWorkout(Long id) {
        if (!strengthWorkoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Treino de musculação não encontrado");
        }
        strengthWorkoutRepository.deleteById(id);
    }

    private StrengthWorkout toEntity(StrengthWorkoutRequestDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        List<MuscleGroups> muscles = muscleGroups.findAllById(dto.muscleGroupsIds());

        StrengthWorkout StrengthWorkout = new StrengthWorkout();
        StrengthWorkout.setEffort(dto.effort());
        StrengthWorkout.setDate(dto.date());
        StrengthWorkout.setUser(user);
        StrengthWorkout.setSets(dto.sets());
        StrengthWorkout.setDurationMinutes(dto.durationMinutes());
        StrengthWorkout.setEquipmentType(dto.equipment());
        StrengthWorkout.setMuscles(muscles); // correto - são os objetos buscados
        return StrengthWorkout;
    }
}

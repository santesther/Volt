package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.config.SecurityUtils;
import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.RunWorkout;
import com.personal.fitanalyzer.domain.StrengthWorkout;
import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.dto.RunWorkoutRequestDTO;
import com.personal.fitanalyzer.dto.RunWorkoutResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.MuscleGroupRepository;
import com.personal.fitanalyzer.repository.RunWorkoutRepository;
import com.personal.fitanalyzer.repository.UserRepository;
import com.personal.fitanalyzer.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RunWorkoutService {

    private final RunWorkoutRepository runWorkoutRepository;
    private final MuscleGroupRepository muscleGroupRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    public RunWorkoutService(RunWorkoutRepository runWorkoutRepository, UserRepository userRepository, MuscleGroupRepository muscleGroupRepository, SecurityUtils securityUtils) {
        this.runWorkoutRepository = runWorkoutRepository;
        this.userRepository = userRepository;
        this.muscleGroupRepository = muscleGroupRepository;
        this.securityUtils = securityUtils;
    }

    @Transactional
    public RunWorkoutResponseDTO createRunWorkout(RunWorkoutRequestDTO runWorkoutRequest) {
        securityUtils.validateUserAccess(runWorkoutRequest.userId());
        RunWorkout runWorkout = toEntity(runWorkoutRequest);
        RunWorkout savedRunWorkout = runWorkoutRepository.save(runWorkout);

        return new RunWorkoutResponseDTO(
                savedRunWorkout.getId(),
                savedRunWorkout.getEffort(),
                savedRunWorkout.getDate(),
                savedRunWorkout.getKm(),
                savedRunWorkout.getDuration(),
                savedRunWorkout.getZone(),
                savedRunWorkout.getPace(),
                savedRunWorkout.getUphill(),
                savedRunWorkout.getDownhill(),
                savedRunWorkout.getClimate()
        );
    }

    public List<RunWorkoutResponseDTO> findAllRunWorkouts() {
        return runWorkoutRepository.findAll().stream()
                .map(runWorkout -> new RunWorkoutResponseDTO(runWorkout.getId(), runWorkout.getEffort(), runWorkout.getDate(), runWorkout.getKm(),
                        runWorkout.getDuration(), runWorkout.getZone(), runWorkout.getPace(), runWorkout.getUphill(), runWorkout.getDownhill(), runWorkout.getClimate()))
                .collect(Collectors.toList());
    }

    public RunWorkout findRunWorkoutById(Long id) {
        return runWorkoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treino de corrida não encontrado"));
    }

    public List<RunWorkout> findRunWorkoutByUserId(Long Userid) {
        return runWorkoutRepository.findByUserId(Userid);
    }

    @Transactional
    public RunWorkoutResponseDTO updateRunWorkout(Long id, RunWorkoutRequestDTO runWorkoutRequest) {
        RunWorkout runWorkout = findRunWorkoutById(id);
        runWorkout.setEffort(runWorkoutRequest.effort());
        runWorkout.setDate(runWorkoutRequest.date());
        runWorkout.setKm(runWorkoutRequest.km());
        runWorkout.setDuration(runWorkoutRequest.duration());
        runWorkout.setZone(runWorkoutRequest.zone());
        float pace = runWorkoutRequest.duration() / runWorkoutRequest.km();
        runWorkout.setPace(pace);
        runWorkout.setUphill(runWorkoutRequest.uphill());
        runWorkout.setDownhill(runWorkoutRequest.downhill());
        runWorkout.setClimate(runWorkoutRequest.weather());

        RunWorkout savedRunWorkout = runWorkoutRepository.save(runWorkout);

        return new RunWorkoutResponseDTO(
                savedRunWorkout.getId(),
                savedRunWorkout.getEffort(),
                savedRunWorkout.getDate(),
                savedRunWorkout.getKm(),
                savedRunWorkout.getDuration(),
                savedRunWorkout.getZone(),
                savedRunWorkout.getPace(),
                savedRunWorkout.getUphill(),
                savedRunWorkout.getDownhill(),
                savedRunWorkout.getClimate()
        );
    }

    @Transactional
    public void deleteRunWorkout(Long id) {
        if (!runWorkoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Treino de corrida não encontrado");
        }
        runWorkoutRepository.deleteById(id);
    }

    @Transactional
    public void updatePainfulMuscles(Long id, List<Long> muscleIds) {
        RunWorkout runWorkout = findRunWorkoutById(id);
        securityUtils.validateUserAccess(runWorkout.getUser().getId());
        List<MuscleGroups> muscles = muscleIds.stream()
                .map(mid -> muscleGroupRepository.findById(mid)
                        .orElseThrow(() -> new ResourceNotFoundException("Grupo muscular não encontrado: " + mid)))
                .collect(Collectors.toList());
        runWorkout.setPainfulMuscles(muscles);
        runWorkoutRepository.save(runWorkout);
    }

    private RunWorkout toEntity(RunWorkoutRequestDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        float pace = dto.duration() / dto.km();

        RunWorkout runWorkout = new RunWorkout();
        runWorkout.setEffort(dto.effort());
        runWorkout.setDate(dto.date());
        runWorkout.setUser(user);
        runWorkout.setKm(dto.km());
        runWorkout.setDuration(dto.duration());
        runWorkout.setZone(dto.zone());
        runWorkout.setUphill(dto.uphill());
        runWorkout.setDownhill(dto.downhill());
        runWorkout.setClimate(dto.weather());
        runWorkout.setPace(pace);
        if (dto.painfulMuscleIds() != null && !dto.painfulMuscleIds().isEmpty()) {
            List<MuscleGroups> painful = dto.painfulMuscleIds().stream()
                    .map(id -> muscleGroupRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Grupo muscular não encontrado: " + id)))
                    .collect(Collectors.toList());
            runWorkout.setPainfulMuscles(painful);
        }
        return runWorkout;
    }
}

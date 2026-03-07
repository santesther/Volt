package com.personal.fitanalyzer.service;

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


    private final UserRepository userRepository;

    public RunWorkoutService(RunWorkoutRepository runWorkoutRepository, UserRepository userRepository) {
        this.runWorkoutRepository = runWorkoutRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RunWorkoutResponseDTO createRunWorkout(RunWorkoutRequestDTO runWorkoutRequest) {
        RunWorkout runWorkout = toEntity(runWorkoutRequest);          // converte DTO → entidade
        RunWorkout savedRunWorkout = runWorkoutRepository.save(runWorkout);

        return new RunWorkoutResponseDTO(                 // converte entidade → ResponseDTO e retorna
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

        RunWorkout savedRunWorkout = runWorkoutRepository.save(runWorkout); // salva as alterações

        return new RunWorkoutResponseDTO(                 // retorna o ResponseDTO
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
        return runWorkout;
    }
}

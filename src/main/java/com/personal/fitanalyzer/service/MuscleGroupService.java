package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.dto.MuscleGroupRequestDTO;
import com.personal.fitanalyzer.dto.MuscleGroupResponseDTO;
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
public class MuscleGroupService {

    private final MuscleGroupRepository muscleGroupsRepository;


    public MuscleGroupService(MuscleGroupRepository muscleGroupsRepository) {
        this.muscleGroupsRepository = muscleGroupsRepository;
    }

    @Transactional
    public MuscleGroupResponseDTO createMuscleGroup(MuscleGroupRequestDTO muscleGroupRequest) {
        MuscleGroups muscleGroups = toEntity(muscleGroupRequest);          // converte DTO → entidade
        MuscleGroups savedMuscleGroups = muscleGroupsRepository.save(muscleGroups);

        return new MuscleGroupResponseDTO(                 // converte entidade → ResponseDTO e retorna
                savedMuscleGroups.getId(),
                savedMuscleGroups.getName(),
                savedMuscleGroups.getRecoveryHours(),
                savedMuscleGroups.getSize(),
                savedMuscleGroups.getAntagonist()
        );
    }

    public List<MuscleGroupResponseDTO> findAllMuscleGroups() {
        return muscleGroupsRepository.findAll().stream()
                .map(muscleGroups -> new MuscleGroupResponseDTO(muscleGroups.getId(), muscleGroups.getName(), muscleGroups.getRecoveryHours(),
                        muscleGroups.getSize(), muscleGroups.getAntagonist()))
                .collect(Collectors.toList());
    }

    public MuscleGroups findMuscleGroupsById(Long id) {
        return muscleGroupsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conjunto de músculos não encontrado"));
    }

    @Transactional
    public MuscleGroupResponseDTO updateMuscleGroup(Long id, MuscleGroupRequestDTO muscleGroupRequest) {
        MuscleGroups muscleGroups = findMuscleGroupsById(id);
        muscleGroups.setName(muscleGroupRequest.name());
        muscleGroups.setSize(muscleGroupRequest.size());
        muscleGroups.setRecoveryHours(muscleGroupRequest.recoveryHours());

        if (muscleGroupRequest.antagonistId() != null) {
            MuscleGroups antagonist = muscleGroupsRepository.findById(muscleGroupRequest.antagonistId())
                    .orElseThrow(() -> new ResourceNotFoundException("Músculo antagonista não encontrado"));
            muscleGroups.setAntagonist(antagonist);
        }

        MuscleGroups savedMuscleGroup = muscleGroupsRepository.save(muscleGroups);

        return new MuscleGroupResponseDTO(
                savedMuscleGroup.getId(),
                savedMuscleGroup.getName(),
                savedMuscleGroup.getRecoveryHours(),
                savedMuscleGroup.getSize(),
                savedMuscleGroup.getAntagonist()
        );
    }

    @Transactional
    public void deleteMuscleGroup(Long id) {
        if (!muscleGroupsRepository.existsById(id)) {
                throw new ResourceNotFoundException("Conjunto de músculos não encontrado");
        }
        muscleGroupsRepository.deleteById(id);
    }

    private MuscleGroups toEntity(MuscleGroupRequestDTO dto) {
        MuscleGroups muscleGroups = new MuscleGroups();
        muscleGroups.setName(dto.name());
        muscleGroups.setSize(dto.size());
        muscleGroups.setRecoveryHours(dto.recoveryHours());

        if (dto.antagonistId() != null) {
            MuscleGroups antagonist = muscleGroupsRepository.findById(dto.antagonistId())
                    .orElseThrow(() -> new ResourceNotFoundException("Músculo antagonista não encontrado"));
            muscleGroups.setAntagonist(antagonist);
        }

        return muscleGroups;
    }
}

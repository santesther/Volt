package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.config.SecurityUtils;
import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.enums.Role;
import com.personal.fitanalyzer.dto.UserRequestDTO;
import com.personal.fitanalyzer.dto.UserResponseDTO;
import com.personal.fitanalyzer.exception.BusinessException;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.TrainingPlanRepository;
import com.personal.fitanalyzer.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TrainingPlanRepository trainingPlanRepository;
    private final SecurityUtils securityUtils;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, TrainingPlanRepository trainingPlanRepository, SecurityUtils securityUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.trainingPlanRepository = trainingPlanRepository;
        this.securityUtils = securityUtils;
    }

    public UserResponseDTO toDTO(User user) {
        String base64 = null;
        if (user.getProfilePicture() != null) {
            base64 = Base64.getEncoder().encodeToString(user.getProfilePicture());
        }
        return new UserResponseDTO(
                user.getId(), user.getName(), user.getEmail(),
                user.getHeight(), user.getWeight(), user.getDateOfBirth(),
                user.getAge(), user.getGender(), user.getGoal(),
                base64
        );
    }

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequest) {
        if (userRepository.existsByEmail(userRequest.email())) {
            throw new BusinessException("Email já cadastrado");
        }
        User user = toEntity(userRequest);
        user.setPassword(passwordEncoder.encode(userRequest.password()));
        return toDTO(userRepository.save(user));
    }

    public List<UserResponseDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    public UserResponseDTO findUserDTOById(Long id) {
        return toDTO(findUserById(id));
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequest) {
        securityUtils.validateUserAccess(id);
        User user = findUserById(id);
        user.setName(userRequest.name());
        user.setEmail(userRequest.email());
        user.setHeight(userRequest.height());
        user.setWeight(userRequest.weight());
        user.setDateOfBirth(userRequest.dateOfBirth());
        user.setGender(userRequest.gender());
        user.setGoal(userRequest.goal());

        if (userRequest.password() != null && !userRequest.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(userRequest.password()));
            user.setPassword_confirmation(userRequest.password_confirmation());
        }

        return toDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO updateProfilePicture(Long id, MultipartFile file) {
        securityUtils.validateUserAccess(id);

        if (file.isEmpty()) {
            throw new BusinessException("Arquivo vazio.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("Apenas imagens são permitidas.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BusinessException("Imagem deve ter no máximo 5MB.");
        }

        User user = findUserById(id);
        try {
            user.setProfilePicture(file.getBytes());
        } catch (IOException e) {
            throw new BusinessException("Erro ao processar imagem.");
        }

        return toDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }
        trainingPlanRepository.findByUserId(id)
                .ifPresent(trainingPlanRepository::delete);
        userRepository.deleteById(id);
    }

    private User toEntity(UserRequestDTO dto) {
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setHeight(dto.height());
        user.setWeight(dto.weight());
        user.setDateOfBirth(dto.dateOfBirth());
        user.setGender(dto.gender());
        user.setPassword(dto.password());
        user.setPassword_confirmation(dto.password_confirmation());
        user.setGoal(dto.goal());
        user.setRole(Role.NORMAL_USER);
        return user;
    }
}
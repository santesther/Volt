package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.enums.Role;
import com.personal.fitanalyzer.dto.UserRequestDTO;
import com.personal.fitanalyzer.dto.UserResponseDTO;
import com.personal.fitanalyzer.exception.BusinessException;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequest) {
        if (userRepository.existsByEmail(userRequest.email())) {
            throw new BusinessException("Email já cadastrado");
        }

        User user = toEntity(userRequest);
        user.setPassword(passwordEncoder.encode(userRequest.password()));
        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getHeight(),
                savedUser.getWeight(),
                savedUser.getDateOfBirth(),
                savedUser.getAge(),
                savedUser.getGender(),
                savedUser.getGoal()
        );
    }

    public List<UserResponseDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getHeight(), user.getWeight(), user.getDateOfBirth(), user.getAge(),
                        user.getGender(), user.getGoal()))
                .collect(Collectors.toList());
    }

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequest) {
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

        User savedUser = userRepository.save(user);
        return new UserResponseDTO(
                savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                savedUser.getHeight(), savedUser.getWeight(), savedUser.getDateOfBirth(),
                savedUser.getAge(), savedUser.getGender(), savedUser.getGoal()
        );
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }
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

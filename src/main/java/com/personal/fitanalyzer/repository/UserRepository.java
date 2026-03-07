package com.personal.fitanalyzer.repository;

import com.personal.fitanalyzer.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
//O JpaRepository<User, Long> já te dá de graça métodos como save, findById, findAll, deleteById e vários outros sem escrever nada.
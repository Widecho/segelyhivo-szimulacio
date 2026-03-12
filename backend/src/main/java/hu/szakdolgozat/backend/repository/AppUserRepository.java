package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String username);

    boolean existsByUsername(String username);

    List<AppUser> findByIsActiveTrue();

    List<AppUser> findByRole_Name(String roleName);

    long countByRole_Name(String roleName);
}
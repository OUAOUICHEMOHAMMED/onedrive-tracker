package com.onedrive.manager.onedrivetracker;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMicrosoftRepository extends JpaRepository<UserMicrosoft, Long> {
    UserMicrosoft findByUsername(String username);
} 
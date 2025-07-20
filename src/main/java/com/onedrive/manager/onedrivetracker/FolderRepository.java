package com.onedrive.manager.onedrivetracker;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    // Méthodes de filtrage personnalisées à ajouter si besoin
} 
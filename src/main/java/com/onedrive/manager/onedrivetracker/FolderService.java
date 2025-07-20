package com.onedrive.manager.onedrivetracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;

    public List<FolderWithStatus> getAllFoldersWithStatus() {
        List<Folder> folders = folderRepository.findAll();
        return folders.stream().map(folder -> new FolderWithStatus(folder, getStatus(folder))).collect(Collectors.toList());
    }

    public Folder save(Folder folder) {
        return folderRepository.save(folder);
    }

    public void delete(Long id) {
        folderRepository.deleteById(id);
    }

    public String getStatus(Folder folder) {
        LocalDate now = LocalDate.now();
        if (folder.getBrokerDateDue() == null) return "UNKNOWN";
        long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(now, folder.getBrokerDateDue());
        if (daysLeft < 0 || daysLeft <= 3) {
            return "RED";
        } else if (daysLeft <= 15) {
            return "ORANGE";
        } else {
            return "GREEN";
        }
    }

    // Suppression automatique des dossiers après 2 mois
    @Scheduled(cron = "0 0 2 * * *") // tous les jours à 2h du matin
    public void deleteExpiredFolders() {
        LocalDate now = LocalDate.now();
        List<Folder> expired = folderRepository.findAll().stream()
            .filter(f -> f.getBrokerDateDue() != null && f.getBrokerDateDue().plusMonths(2).isBefore(now))
            .collect(Collectors.toList());
        expired.forEach(f -> folderRepository.deleteById(f.getId()));
    }

    // Classe pour renvoyer le statut avec le dossier
    public static class FolderWithStatus {
        public Folder folder;
        public String status;
        public FolderWithStatus(Folder folder, String status) {
            this.folder = folder;
            this.status = status;
        }
    }
} 
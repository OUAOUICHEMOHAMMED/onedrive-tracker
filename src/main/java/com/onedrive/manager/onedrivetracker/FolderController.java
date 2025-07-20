package com.onedrive.manager.onedrivetracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.List;

@RestController
@RequestMapping("/folders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FolderController {
    @Autowired
    private FolderService folderService;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping
    public List<FolderService.FolderWithStatus> getAllFolders() {
        return folderService.getAllFoldersWithStatus();
    }

    @PostMapping
    public Folder createFolder(@RequestBody Folder folder) {
        return folderService.save(folder);
    }

    @DeleteMapping("/{id}")
    public void deleteFolder(@PathVariable Long id) {
        folderService.delete(id);
    }

    @PostMapping("/send-alert")
    public void sendAlertEmail(@RequestBody EmailRequest request) {
        String to = request.to;
        String subject = "Alerte suppression dossier : " + request.folder.getName();
        String text = request.message; // Utilise le message reçu du frontend

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    public static class EmailRequest {
        public Folder folder;
        public String to;
        public String message;
    }
} 
package com.onedrive.manager.onedrivetracker;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String officeId;
    private String path;
    private LocalDate brokerDate;
    private LocalDate brokerDateDue;
    private String computerName;
    private String createUser;
    private LocalDateTime createDate;
    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOfficeId() { return officeId; }
    public void setOfficeId(String officeId) { this.officeId = officeId; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public LocalDate getBrokerDate() { return brokerDate; }
    public void setBrokerDate(LocalDate brokerDate) { this.brokerDate = brokerDate; }
    public LocalDate getBrokerDateDue() { return brokerDateDue; }
    public void setBrokerDateDue(LocalDate brokerDateDue) { this.brokerDateDue = brokerDateDue; }
    public String getComputerName() { return computerName; }
    public void setComputerName(String computerName) { this.computerName = computerName; }
    public String getCreateUser() { return createUser; }
    public void setCreateUser(String createUser) { this.createUser = createUser; }
    public LocalDateTime getCreateDate() { return createDate; }
    public void setCreateDate(LocalDateTime createDate) { this.createDate = createDate; }
} 
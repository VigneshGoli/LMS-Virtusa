package com.example.library.controller;

import com.example.library.dto.ActivityLogDto;
import com.example.library.dto.DashboardStatsDto;
import com.example.library.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardStatsDto getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/activity")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogDto> getActivity() {
        return dashboardService.getRecentActivities();
    }
}


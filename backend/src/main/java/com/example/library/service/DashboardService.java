package com.example.library.service;

import com.example.library.dto.ActivityLogDto;
import com.example.library.dto.DashboardStatsDto;

import java.util.List;

public interface DashboardService {

    DashboardStatsDto getStats();

    List<ActivityLogDto> getRecentActivities();
}


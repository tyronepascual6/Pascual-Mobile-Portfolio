// ===== ICON LIBRARY =====
// Ionicons provides ready-to-use icons for the tab bar
import { Ionicons } from '@expo/vector-icons';

// ===== EXPO ROUTER TABS =====
// Tabs creates a bottom tab navigation layout
import { Tabs } from "expo-router";

import React from "react";

// ===== TAB LAYOUT COMPONENT =====
// This file defines the global bottom navigation tabs
export default function TabLayout() {
  return (
    // Tabs wraps all tab screens
    <Tabs
      screenOptions={{
        headerShown: false, // Hides the top header for all tabs
      }}
    >

      {/* ===== HOME TAB ===== */}
      <Tabs.Screen
        name="index" // Must match index.tsx
        options={{
          title: 'Home', // Label shown under the tab icon
          tabBarIcon: ({ color, size }) => (
            // Home icon that automatically adapts
            // to active/inactive tab color and size
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ===== CERTIFICATES TAB ===== */}
      <Tabs.Screen
        name="certificates" // Must match certificates.tsx
        options={{
          title: 'Certificates',
          tabBarIcon: ({ color, size }) => (
            // Document icon to represent certificates
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />

      {/* ===== PROJECTS TAB ===== */}
      <Tabs.Screen
        name="projects" // Must match project.tsx
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => (
            // Briefcase icon to represent work/projects
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />

        {/* Hide project detail screen */}
  <Tabs.Screen name="project/[id]" options={{ href: null }} />
  <Tabs.Screen name="projectscreener/[id]" options={{ href: null }} />
  <Tabs.Screen name="login" options={{ href: null }} />
  <Tabs.Screen name="signup" options={{ href: null }} />
  <Tabs.Screen name="chat" options={{ href: null }} />

    </Tabs>
  );
}

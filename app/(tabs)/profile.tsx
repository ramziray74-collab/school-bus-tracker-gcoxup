
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { mockBusInfo } from '@/data/mockBusData';

export default function ProfileScreen() {
  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alert preferences',
      icon: 'bell.fill',
    },
    {
      id: 'route',
      title: 'Route Settings',
      description: 'Configure bus route details',
      icon: 'map.fill',
    },
    {
      id: 'students',
      title: 'Manage Students',
      description: 'Add or remove students',
      icon: 'person.3.fill',
    },
    {
      id: 'tracking',
      title: 'Tracking Device',
      description: 'Fleet tracking device settings',
      icon: 'antenna.radiowaves.left.and.right',
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'View attendance reports',
      icon: 'chart.bar.fill',
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get assistance',
      icon: 'questionmark.circle.fill',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={styles.driverName}>{mockBusInfo.driverName}</Text>
          <Text style={styles.busNumber}>{mockBusInfo.busNumber}</Text>
          <View style={styles.routeBadge}>
            <IconSymbol name="bus" size={16} color={colors.card} />
            <Text style={styles.routeText}>{mockBusInfo.route}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="person.3.fill" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{mockBusInfo.students.length}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={styles.statValue}>{mockBusInfo.capacity}</Text>
            <Text style={styles.statLabel}>Capacity</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.settingItem,
                pressed && styles.settingItemPressed,
              ]}
              onPress={() => console.log(`Pressed: ${option.id}`)}
            >
              <View style={styles.settingIconContainer}>
                <IconSymbol name={option.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingDescription}>{option.description}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About School Bus Tracker</Text>
          <Text style={styles.aboutText}>
            This app helps monitor school bus locations and track student attendance in real-time. 
            Connect with your fleet tracking device for live GPS updates.
          </Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  driverName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  routeText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  settingItemPressed: {
    opacity: 0.7,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  aboutContainer: {
    padding: 16,
    marginTop: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

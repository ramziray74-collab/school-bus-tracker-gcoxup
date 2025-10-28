
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { mockBusInfo } from '@/data/mockBusData';
import { BusInfo, Student, AttendanceRecord } from '@/types/bus';
import BusMapPlaceholder from '@/components/BusMapPlaceholder';
import BusInfoCard from '@/components/BusInfoCard';
import StudentListItem from '@/components/StudentListItem';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const [busInfo, setBusInfo] = useState<BusInfo>(mockBusInfo);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const { location, errorMsg, isTracking, permissionStatus, startTracking, stopTracking } = useLocationTracking();

  useEffect(() => {
    // Auto-start tracking when permission is granted
    if (permissionStatus === 'granted' && !isTracking) {
      startTracking();
    }
  }, [permissionStatus]);

  const handleToggleStudent = (studentId: string) => {
    setBusInfo(prevInfo => {
      const updatedStudents = prevInfo.students.map(student => {
        if (student.id === studentId) {
          const newOnBusStatus = !student.onBus;
          const timestamp = Date.now();

          // Add to attendance history
          if (location) {
            const record: AttendanceRecord = {
              studentId: student.id,
              studentName: student.name,
              action: newOnBusStatus ? 'boarded' : 'alighted',
              timestamp,
              location,
            };
            setAttendanceHistory(prev => [record, ...prev]);
          }

          return {
            ...student,
            onBus: newOnBusStatus,
            boardedAt: newOnBusStatus ? timestamp : student.boardedAt,
            alightedAt: !newOnBusStatus ? timestamp : student.alightedAt,
          };
        }
        return student;
      });

      return {
        ...prevInfo,
        students: updatedStudents,
      };
    });
  };

  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      startTracking();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const onBusCount = busInfo.students.filter(s => s.onBus).length;

  const renderHeaderRight = () => (
    <Pressable
      onPress={handleToggleTracking}
      style={styles.headerButtonContainer}
    >
      <IconSymbol 
        name={isTracking ? "location.fill" : "location"} 
        color={isTracking ? colors.success : colors.textSecondary} 
        size={24}
      />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "School Bus Tracker",
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Location Status */}
          {errorMsg && (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.error} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {permissionStatus === 'denied' && (
            <View style={styles.warningContainer}>
              <IconSymbol name="location.slash.fill" size={20} color={colors.warning} />
              <Text style={styles.warningText}>
                Location permission denied. Please enable location services in settings.
              </Text>
            </View>
          )}

          {/* Map Placeholder */}
          <BusMapPlaceholder location={location} />

          {/* Bus Info Card */}
          <BusInfoCard busInfo={busInfo} onBusCount={onBusCount} />

          {/* Student List Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Student Attendance</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {onBusCount}/{busInfo.students.length}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionSubtitle}>
              Tap to check students on/off the bus
            </Text>

            {busInfo.students.map(student => (
              <StudentListItem
                key={student.id}
                student={student}
                onToggle={handleToggleStudent}
              />
            ))}
          </View>

          {/* Attendance History */}
          {attendanceHistory.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {attendanceHistory.slice(0, 5).map((record, index) => (
                <View key={`${record.studentId}-${record.timestamp}`} style={styles.historyItem}>
                  <View style={[
                    styles.historyIcon,
                    { backgroundColor: record.action === 'boarded' ? colors.success : colors.warning }
                  ]}>
                    <IconSymbol 
                      name={record.action === 'boarded' ? "arrow.up.circle.fill" : "arrow.down.circle.fill"} 
                      size={16} 
                      color={colors.card} 
                    />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyName}>{record.studentName}</Text>
                    <Text style={styles.historyAction}>
                      {record.action === 'boarded' ? 'Boarded the bus' : 'Alighted from the bus'}
                    </Text>
                    <Text style={styles.historyTime}>
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
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
  headerButtonContainer: {
    padding: 8,
    marginRight: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: colors.card,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  warningText: {
    color: colors.card,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  countBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
    elevation: 1,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  historyAction: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

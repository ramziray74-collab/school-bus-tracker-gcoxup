
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useBus } from '@/contexts/BusContext';
import { AttendanceRecord } from '@/types/bus';
import BusInfoCard from '@/components/BusInfoCard';
import StudentListItem from '@/components/StudentListItem';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const { busInfo, setBusInfo, unreadCount } = useBus();
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const { location, errorMsg, isTracking, permissionStatus, startTracking, stopTracking } =
    useLocationTracking();

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

  const handleOpenMap = () => {
    if (location) {
      router.push({
        pathname: '/(tabs)/(home)/map-view',
        params: {
          lat: location.latitude.toString(),
          lng: location.longitude.toString(),
        },
      });
    } else {
      Alert.alert('No Location', 'Location data is not available yet.');
    }
  };

  const handleStudentPress = (studentId: string) => {
    router.push({
      pathname: '/(tabs)/(home)/student-details',
      params: { id: studentId },
    });
  };

  const onBusCount = busInfo.students.filter(s => s.onBus).length;
  const overdueCount = busInfo.students.filter(s => s.payment.isOverdue).length;

  const renderHeaderRight = () => (
    <View style={styles.headerRightContainer}>
      <Pressable onPress={() => router.push('/(tabs)/(home)/notifications')} style={styles.headerButton}>
        <IconSymbol name="bell.fill" color={colors.text} size={24} />
        {unreadCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </Pressable>
      <Pressable onPress={handleToggleTracking} style={styles.headerButton}>
        <IconSymbol
          name={isTracking ? 'location.fill' : 'location'}
          color={isTracking ? colors.success : colors.textSecondary}
          size={24}
        />
      </Pressable>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'School Bus Tracker',
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
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
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

          {/* Overdue Payments Alert */}
          {overdueCount > 0 && (
            <Pressable
              style={styles.overdueAlert}
              onPress={() => router.push('/(tabs)/(home)/notifications')}
            >
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.card} />
              <View style={styles.overdueAlertContent}>
                <Text style={styles.overdueAlertTitle}>Payment Alert</Text>
                <Text style={styles.overdueAlertText}>
                  {overdueCount} student{overdueCount !== 1 ? 's have' : ' has'} overdue payments
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.card} />
            </Pressable>
          )}

          {/* Map Button */}
          <Pressable
            style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]}
            onPress={handleOpenMap}
          >
            <View style={styles.mapButtonContent}>
              <IconSymbol name="map.fill" size={48} color={colors.primary} />
              <View style={styles.mapButtonTextContainer}>
                <Text style={styles.mapButtonTitle}>View on Map</Text>
                <Text style={styles.mapButtonSubtitle}>
                  {location
                    ? 'Tap to open interactive map'
                    : 'Waiting for location data...'}
                </Text>
              </View>
            </View>
            {location && (
              <View style={styles.locationBadge}>
                <IconSymbol name="location.fill" size={16} color={colors.success} />
                <Text style={styles.locationBadgeText}>Live</Text>
              </View>
            )}
          </Pressable>

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
              Tap to check students on/off the bus, or tap name for details
            </Text>

            {busInfo.students.map(student => (
              <Pressable
                key={student.id}
                onLongPress={() => handleStudentPress(student.id)}
                style={({ pressed }) => [pressed && styles.studentItemPressed]}
              >
                <StudentListItem student={student} onToggle={handleToggleStudent} />
              </Pressable>
            ))}
          </View>

          {/* Attendance History */}
          {attendanceHistory.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {attendanceHistory.slice(0, 5).map((record, index) => (
                <View
                  key={`${record.studentId}-${record.timestamp}`}
                  style={styles.historyItem}
                >
                  <View
                    style={[
                      styles.historyIcon,
                      {
                        backgroundColor:
                          record.action === 'boarded' ? colors.success : colors.warning,
                      },
                    ]}
                  >
                    <IconSymbol
                      name={
                        record.action === 'boarded'
                          ? 'arrow.up.circle.fill'
                          : 'arrow.down.circle.fill'
                      }
                      size={16}
                      color={colors.card}
                    />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyName}>{record.studentName}</Text>
                    <Text style={styles.historyAction}>
                      {record.action === 'boarded'
                        ? 'Boarded the bus'
                        : 'Alighted from the bus'}
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
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: colors.card,
    fontSize: 11,
    fontWeight: '700',
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
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  overdueAlertContent: {
    flex: 1,
    marginLeft: 12,
  },
  overdueAlertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 2,
  },
  overdueAlertText: {
    fontSize: 14,
    color: colors.card,
  },
  mapButton: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  mapButtonPressed: {
    opacity: 0.7,
  },
  mapButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButtonTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  mapButtonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  mapButtonSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 4,
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
  studentItemPressed: {
    opacity: 0.7,
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

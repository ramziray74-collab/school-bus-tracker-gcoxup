
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useBus } from '@/contexts/BusContext';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { busInfo, updateDriverName } = useBus();
  const [isEditingDriver, setIsEditingDriver] = useState(false);
  const [driverName, setDriverName] = useState(busInfo.driverName);

  const handleSaveDriverName = () => {
    if (!driverName.trim()) {
      Alert.alert('Error', 'Please enter a driver name');
      return;
    }

    updateDriverName(driverName.trim());
    setIsEditingDriver(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Driver name updated successfully');
  };

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

  const overdueCount = busInfo.students.filter(s => s.payment.isOverdue).length;
  const paidCount = busInfo.students.filter(s => s.payment.isPaid).length;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>

          {isEditingDriver ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={driverName}
                onChangeText={setDriverName}
                placeholder="Enter driver name"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
              <View style={styles.editButtons}>
                <Pressable
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => {
                    setDriverName(busInfo.driverName);
                    setIsEditingDriver(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleSaveDriverName}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.driverNameContainer}>
                <Text style={styles.driverName}>{busInfo.driverName}</Text>
                <Pressable
                  onPress={() => setIsEditingDriver(true)}
                  style={styles.editIconButton}
                >
                  <IconSymbol name="pencil.circle.fill" size={24} color={colors.primary} />
                </Pressable>
              </View>
            </>
          )}

          <Text style={styles.busNumber}>{busInfo.busNumber}</Text>
          <View style={styles.routeBadge}>
            <IconSymbol name="bus" size={16} color={colors.card} />
            <Text style={styles.routeText}>{busInfo.route}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="person.3.fill" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{busInfo.students.length}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={styles.statValue}>{paidCount}</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.error} />
            <Text style={styles.statValue}>{overdueCount}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentSummary}>
          <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
          <View style={styles.paymentSummaryRow}>
            <Text style={styles.paymentSummaryLabel}>Total Monthly Revenue:</Text>
            <Text style={styles.paymentSummaryValue}>
              ${busInfo.students.reduce((sum, s) => sum + s.payment.monthlyAmount, 0)}
            </Text>
          </View>
          <View style={styles.paymentSummaryRow}>
            <Text style={styles.paymentSummaryLabel}>Collected:</Text>
            <Text style={[styles.paymentSummaryValue, { color: colors.success }]}>
              $
              {busInfo.students
                .filter(s => s.payment.isPaid)
                .reduce((sum, s) => sum + s.payment.monthlyAmount, 0)}
            </Text>
          </View>
          <View style={styles.paymentSummaryRow}>
            <Text style={styles.paymentSummaryLabel}>Outstanding:</Text>
            <Text style={[styles.paymentSummaryValue, { color: colors.error }]}>
              $
              {busInfo.students
                .filter(s => !s.payment.isPaid)
                .reduce((sum, s) => sum + s.payment.monthlyAmount, 0)}
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map(option => (
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
  driverNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  editIconButton: {
    marginLeft: 8,
    padding: 4,
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
  },
  editInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primary,
    width: '80%',
    textAlign: 'center',
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
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
  paymentSummary: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  paymentSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentSummaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentSummaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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

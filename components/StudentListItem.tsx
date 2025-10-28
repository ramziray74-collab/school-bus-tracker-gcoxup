
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Student } from '@/types/bus';
import * as Haptics from 'expo-haptics';

interface StudentListItemProps {
  student: Student;
  onToggle: (studentId: string) => void;
}

export default function StudentListItem({ student, onToggle }: StudentListItemProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle(student.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.leftContent}>
        <View style={[
          styles.checkbox,
          student.onBus && styles.checkboxChecked
        ]}>
          {student.onBus && (
            <IconSymbol name="checkmark" size={16} color={colors.card} />
          )}
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentGrade}>{student.grade}</Text>
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={12} color={colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {student.pickupLocation}
            </Text>
          </View>
        </View>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: student.onBus ? colors.success : colors.border }
      ]}>
        <Text style={[
          styles.statusText,
          { color: student.onBus ? colors.card : colors.textSecondary }
        ]}>
          {student.onBus ? 'On Bus' : 'Off Bus'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  studentGrade: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});


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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(student.id);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.checkboxContainer,
          pressed && styles.checkboxPressed,
        ]}
        onPress={handlePress}
      >
        <View
          style={[
            styles.checkbox,
            student.onBus && styles.checkboxChecked,
          ]}
        >
          {student.onBus && (
            <IconSymbol name="checkmark" size={18} color={colors.card} />
          )}
        </View>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{student.name}</Text>
          {student.payment.isOverdue && (
            <View style={styles.overdueBadge}>
              <IconSymbol name="exclamationmark.circle.fill" size={14} color={colors.card} />
              <Text style={styles.overdueBadgeText}>Overdue</Text>
            </View>
          )}
        </View>
        <View style={styles.infoRow}>
          <IconSymbol name="person.fill" size={12} color={colors.textSecondary} />
          <Text style={styles.infoText}>{student.age} years • {student.grade}</Text>
        </View>
        <View style={styles.infoRow}>
          <IconSymbol name="house.fill" size={12} color={colors.textSecondary} />
          <Text style={styles.infoText}>{student.address}</Text>
        </View>
        <View style={styles.paymentRow}>
          <View style={styles.paymentInfo}>
            <IconSymbol name="dollarsign.circle.fill" size={14} color={colors.primary} />
            <Text style={styles.paymentText}>${student.payment.monthlyAmount}/month</Text>
          </View>
          {student.payment.isPaid ? (
            <View style={[styles.paymentStatusBadge, { backgroundColor: colors.success }]}>
              <IconSymbol name="checkmark.circle.fill" size={12} color={colors.card} />
              <Text style={styles.paymentStatusText}>Paid</Text>
            </View>
          ) : (
            <View style={[styles.paymentStatusBadge, { backgroundColor: colors.error }]}>
              <IconSymbol name="xmark.circle.fill" size={12} color={colors.card} />
              <Text style={styles.paymentStatusText}>Unpaid</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: student.onBus ? colors.success : colors.textSecondary },
          ]}
        />
        <Text style={styles.statusText}>{student.onBus ? 'On Bus' : 'Off Bus'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkboxPressed: {
    opacity: 0.6,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
  overdueBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

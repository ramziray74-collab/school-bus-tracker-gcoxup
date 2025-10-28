
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useBus } from '@/contexts/BusContext';
import * as Haptics from 'expo-haptics';

export default function StudentDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const studentId = params.id as string;
  const { busInfo, updateStudent, markPaymentAsPaid } = useBus();

  const student = busInfo.students.find(s => s.id === studentId);

  const [name, setName] = useState(student?.name || '');
  const [age, setAge] = useState(student?.age.toString() || '');
  const [address, setAddress] = useState(student?.address || '');
  const [monthlyAmount, setMonthlyAmount] = useState(
    student?.payment.monthlyAmount.toString() || ''
  );

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Student not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a student name');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      Alert.alert('Error', 'Please enter a valid age (1-18)');
      return;
    }

    const amountNum = parseFloat(monthlyAmount);
    if (isNaN(amountNum) || amountNum < 0) {
      Alert.alert('Error', 'Please enter a valid monthly amount');
      return;
    }

    updateStudent(studentId, {
      name: name.trim(),
      age: ageNum,
      address: address.trim(),
      payment: {
        ...student.payment,
        monthlyAmount: amountNum,
      },
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Student information updated successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Confirm Payment',
      `Mark payment of $${student.payment.monthlyAmount} as paid for ${student.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            markPaymentAsPaid(studentId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Payment marked as paid');
          },
        },
      ]
    );
  };

  const daysOverdue = student.payment.isOverdue
    ? Math.floor((Date.now() - student.payment.dueDate) / (24 * 60 * 60 * 1000))
    : 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Student Details',
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
          {/* Payment Status Banner */}
          {student.payment.isOverdue && (
            <View style={styles.overdueBanner}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.card} />
              <View style={styles.overdueBannerContent}>
                <Text style={styles.overdueBannerTitle}>Payment Overdue</Text>
                <Text style={styles.overdueBannerText}>{daysOverdue} days overdue</Text>
              </View>
            </View>
          )}

          {/* Student Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Student Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter student name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter age"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Grade</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>{student.grade}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter full address"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Payment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Monthly Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={monthlyAmount}
                onChangeText={setMonthlyAmount}
                placeholder="Enter monthly amount"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.paymentStatusCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Status:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: student.payment.isPaid
                        ? colors.success
                        : student.payment.isOverdue
                        ? colors.error
                        : colors.warning,
                    },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {student.payment.isPaid
                      ? 'Paid'
                      : student.payment.isOverdue
                      ? 'Overdue'
                      : 'Pending'}
                  </Text>
                </View>
              </View>

              {student.payment.lastPaymentDate && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Last Payment:</Text>
                  <Text style={styles.paymentValue}>
                    {new Date(student.payment.lastPaymentDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Due Date:</Text>
                <Text style={styles.paymentValue}>
                  {new Date(student.payment.dueDate).toLocaleDateString()}
                </Text>
              </View>

              {!student.payment.isPaid && (
                <Pressable
                  style={({ pressed }) => [
                    styles.markPaidButton,
                    pressed && styles.markPaidButtonPressed,
                  ]}
                  onPress={handleMarkAsPaid}
                >
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
                  <Text style={styles.markPaidButtonText}>Mark as Paid</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
            onPress={handleSave}
          >
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.card} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
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
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
  overdueanner: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  overdueBannerContent: {
    marginLeft: 12,
    flex: 1,
  },
  overdueBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 2,
  },
  overdueBannerText: {
    fontSize: 14,
    color: colors.card,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  paymentStatusCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paymentValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  markPaidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  markPaidButtonPressed: {
    opacity: 0.7,
  },
  markPaidButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    margin: 16,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  saveButtonPressed: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
});

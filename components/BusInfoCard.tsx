
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { BusInfo } from '@/types/bus';

interface BusInfoCardProps {
  busInfo: BusInfo;
  onBusCount: number;
}

export default function BusInfoCard({ busInfo, onBusCount }: BusInfoCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.busIconContainer}>
          <IconSymbol name="bus" size={32} color={colors.card} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.busNumber}>{busInfo.busNumber}</Text>
          <Text style={styles.route}>{busInfo.route}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <IconSymbol name="person.fill" size={20} color={colors.textSecondary} />
          <Text style={styles.infoLabel}>Driver</Text>
          <Text style={styles.infoValue}>{busInfo.driverName}</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.infoItem}>
          <IconSymbol name="person.3.fill" size={20} color={colors.textSecondary} />
          <Text style={styles.infoLabel}>Capacity</Text>
          <Text style={styles.infoValue}>
            {onBusCount} / {busInfo.capacity}
          </Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: onBusCount > 0 ? colors.success : colors.textSecondary }]} />
        <Text style={styles.statusText}>
          {onBusCount > 0 ? `${onBusCount} student${onBusCount !== 1 ? 's' : ''} on board` : 'No students on board'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  busIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  busNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  route: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});

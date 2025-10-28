
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { BusLocation } from '@/types/bus';

interface BusMapPlaceholderProps {
  location: BusLocation | null;
}

export default function BusMapPlaceholder({ location }: BusMapPlaceholderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSymbol name="map" size={64} color={colors.primary} />
      </View>
      <Text style={styles.title}>Map View</Text>
      <Text style={styles.subtitle}>
        Note: react-native-maps is not supported on web in Natively
      </Text>
      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.infoTitle}>Current Location:</Text>
          <Text style={styles.infoText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.infoText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
          {location.speed !== undefined && (
            <Text style={styles.infoText}>
              Speed: {(location.speed * 3.6).toFixed(1)} km/h
            </Text>
          )}
          {location.heading !== undefined && (
            <Text style={styles.infoText}>
              Heading: {location.heading.toFixed(0)}°
            </Text>
          )}
          <Text style={styles.infoText}>
            Last Updated: {new Date(location.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      )}
      <View style={styles.findMyIphoneContainer}>
        <IconSymbol name="location.fill" size={24} color={colors.accent} />
        <Text style={styles.findMyIphoneText}>
          GPS interface connected with Find My iPhone
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    margin: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  locationInfo: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  findMyIphoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  findMyIphoneText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
});

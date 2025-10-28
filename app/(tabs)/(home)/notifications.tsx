
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useBus } from '@/contexts/BusContext';
import * as Haptics from 'expo-haptics';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markNotificationAsRead, clearAllNotifications, unreadCount } = useBus();

  const handleNotificationPress = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_overdue':
        return 'exclamationmark.triangle.fill';
      case 'payment_reminder':
        return 'bell.fill';
      case 'attendance':
        return 'person.fill.checkmark';
      case 'system':
        return 'info.circle.fill';
      default:
        return 'bell.fill';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment_overdue':
        return colors.error;
      case 'payment_reminder':
        return colors.warning;
      case 'attendance':
        return colors.success;
      case 'system':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerRight: () =>
            notifications.length > 0 ? (
              <Pressable onPress={handleClearAll} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </Pressable>
            ) : null,
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
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="bell.slash.fill" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                You&apos;re all caught up! Notifications will appear here.
              </Text>
            </View>
          ) : (
            <>
              {unreadCount > 0 && (
                <View style={styles.unreadBanner}>
                  <IconSymbol name="bell.badge.fill" size={20} color={colors.primary} />
                  <Text style={styles.unreadText}>
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}

              {notifications.map(notification => (
                <Pressable
                  key={notification.id}
                  style={({ pressed }) => [
                    styles.notificationItem,
                    !notification.read && styles.notificationItemUnread,
                    pressed && styles.notificationItemPressed,
                  ]}
                  onPress={() => handleNotificationPress(notification.id)}
                >
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: getNotificationColor(notification.type) },
                    ]}
                  >
                    <IconSymbol
                      name={getNotificationIcon(notification.type) as any}
                      size={24}
                      color={colors.card}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    {notification.studentName && (
                      <View style={styles.studentBadge}>
                        <IconSymbol name="person.fill" size={12} color={colors.primary} />
                        <Text style={styles.studentBadgeText}>{notification.studentName}</Text>
                      </View>
                    )}
                    <Text style={styles.notificationTime}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </>
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
  clearButton: {
    marginRight: 16,
  },
  clearButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  unreadText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  notificationItemUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationItemPressed: {
    opacity: 0.7,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  studentBadgeText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

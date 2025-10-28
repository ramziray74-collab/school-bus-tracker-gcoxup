
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusInfo, Student, NotificationItem } from '@/types/bus';
import { mockBusInfo } from '@/data/mockBusData';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface BusContextType {
  busInfo: BusInfo;
  setBusInfo: React.Dispatch<React.SetStateAction<BusInfo>>;
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  updateStudent: (studentId: string, updates: Partial<Student>) => void;
  updateDriverName: (name: string) => void;
  markPaymentAsPaid: (studentId: string) => void;
}

const BusContext = createContext<BusContextType | undefined>(undefined);

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function BusProvider({ children }: { children: ReactNode }) {
  const [busInfo, setBusInfo] = useState<BusInfo>(mockBusInfo);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Check for overdue payments on mount and periodically
  useEffect(() => {
    checkOverduePayments();
    const interval = setInterval(checkOverduePayments, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [busInfo.students]);

  // Request notification permissions
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('payment-reminders', {
        name: 'Payment Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
    }
  };

  const checkOverduePayments = () => {
    const now = Date.now();
    busInfo.students.forEach(student => {
      if (student.payment.isOverdue && !student.payment.isPaid) {
        const existingNotification = notifications.find(
          n => n.studentId === student.id && n.type === 'payment_overdue' && !n.read
        );
        
        if (!existingNotification) {
          addNotification({
            type: 'payment_overdue',
            title: 'Payment Overdue',
            message: `Payment for ${student.name} is overdue. Amount: $${student.payment.monthlyAmount}`,
            studentId: student.id,
            studentName: student.name,
          });

          // Schedule local notification
          schedulePaymentNotification(student);
        }
      }
    });
  };

  const schedulePaymentNotification = async (student: Student) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Payment Overdue',
          body: `Payment for ${student.name} is overdue. Amount: $${student.payment.monthlyAmount}`,
          data: { studentId: student.id, type: 'payment_overdue' },
          sound: true,
        },
        trigger: null, // Immediate notification
      });
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    setBusInfo(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.id === studentId ? { ...student, ...updates } : student
      ),
    }));
  };

  const updateDriverName = (name: string) => {
    setBusInfo(prev => ({
      ...prev,
      driverName: name,
    }));
  };

  const markPaymentAsPaid = (studentId: string) => {
    const now = Date.now();
    const nextDueDate = now + 30 * 24 * 60 * 60 * 1000; // 30 days from now

    setBusInfo(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.id === studentId
          ? {
              ...student,
              payment: {
                ...student.payment,
                isPaid: true,
                isOverdue: false,
                lastPaymentDate: now,
                dueDate: nextDueDate,
              },
            }
          : student
      ),
    }));

    // Mark related notifications as read
    setNotifications(prev =>
      prev.map(notif =>
        notif.studentId === studentId && notif.type === 'payment_overdue'
          ? { ...notif, read: true }
          : notif
      )
    );

    // Add success notification
    const student = busInfo.students.find(s => s.id === studentId);
    if (student) {
      addNotification({
        type: 'system',
        title: 'Payment Received',
        message: `Payment of $${student.payment.monthlyAmount} received for ${student.name}`,
        studentId: student.id,
        studentName: student.name,
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <BusContext.Provider
      value={{
        busInfo,
        setBusInfo,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        unreadCount,
        updateStudent,
        updateDriverName,
        markPaymentAsPaid,
      }}
    >
      {children}
    </BusContext.Provider>
  );
}

export function useBus() {
  const context = useContext(BusContext);
  if (context === undefined) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
}

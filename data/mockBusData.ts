
import { BusInfo, Student } from '@/types/bus';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    age: 10,
    grade: '5th Grade',
    address: '123 Oak Street, Springfield',
    pickupLocation: '123 Oak Street',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
    payment: {
      monthlyAmount: 150,
      lastPaymentDate: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
      dueDate: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days overdue
      isPaid: false,
      isOverdue: true,
    },
  },
  {
    id: '2',
    name: 'Liam Smith',
    age: 9,
    grade: '4th Grade',
    address: '456 Maple Avenue, Springfield',
    pickupLocation: '456 Maple Avenue',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
    payment: {
      monthlyAmount: 150,
      lastPaymentDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
      dueDate: Date.now() + 20 * 24 * 60 * 60 * 1000,
      isPaid: true,
      isOverdue: false,
    },
  },
  {
    id: '3',
    name: 'Olivia Brown',
    age: 11,
    grade: '6th Grade',
    address: '789 Pine Road, Springfield',
    pickupLocation: '789 Pine Road',
    dropoffLocation: 'Washington Middle School',
    onBus: false,
    payment: {
      monthlyAmount: 175,
      lastPaymentDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
      dueDate: Date.now() + 25 * 24 * 60 * 60 * 1000,
      isPaid: true,
      isOverdue: false,
    },
  },
  {
    id: '4',
    name: 'Noah Davis',
    age: 8,
    grade: '3rd Grade',
    address: '321 Elm Street, Springfield',
    pickupLocation: '321 Elm Street',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
    payment: {
      monthlyAmount: 150,
      lastPaymentDate: Date.now() - 35 * 24 * 60 * 60 * 1000,
      dueDate: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days overdue
      isPaid: false,
      isOverdue: true,
    },
  },
  {
    id: '5',
    name: 'Ava Wilson',
    age: 10,
    grade: '5th Grade',
    address: '654 Birch Lane, Springfield',
    pickupLocation: '654 Birch Lane',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
    payment: {
      monthlyAmount: 150,
      lastPaymentDate: Date.now() - 8 * 24 * 60 * 60 * 1000,
      dueDate: Date.now() + 22 * 24 * 60 * 60 * 1000,
      isPaid: true,
      isOverdue: false,
    },
  },
  {
    id: '6',
    name: 'Ethan Martinez',
    age: 9,
    grade: '4th Grade',
    address: '987 Cedar Court, Springfield',
    pickupLocation: '987 Cedar Court',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
    payment: {
      monthlyAmount: 150,
      lastPaymentDate: Date.now() - 12 * 24 * 60 * 60 * 1000,
      dueDate: Date.now() + 18 * 24 * 60 * 60 * 1000,
      isPaid: true,
      isOverdue: false,
    },
  },
];

export const mockBusInfo: BusInfo = {
  id: 'bus-001',
  busNumber: 'Bus #42',
  driverName: 'Michael Anderson',
  capacity: 45,
  route: 'Route A - North District',
  students: mockStudents,
};

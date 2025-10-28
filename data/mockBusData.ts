
import { BusInfo, Student } from '@/types/bus';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    grade: '5th Grade',
    pickupLocation: '123 Oak Street',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
  },
  {
    id: '2',
    name: 'Liam Smith',
    grade: '4th Grade',
    pickupLocation: '456 Maple Avenue',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
  },
  {
    id: '3',
    name: 'Olivia Brown',
    grade: '6th Grade',
    pickupLocation: '789 Pine Road',
    dropoffLocation: 'Washington Middle School',
    onBus: false,
  },
  {
    id: '4',
    name: 'Noah Davis',
    grade: '3rd Grade',
    pickupLocation: '321 Elm Street',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
  },
  {
    id: '5',
    name: 'Ava Wilson',
    grade: '5th Grade',
    pickupLocation: '654 Birch Lane',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
  },
  {
    id: '6',
    name: 'Ethan Martinez',
    grade: '4th Grade',
    pickupLocation: '987 Cedar Court',
    dropoffLocation: 'Lincoln Elementary',
    onBus: false,
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

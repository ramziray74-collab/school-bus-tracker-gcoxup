
export interface BusLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

export interface PaymentInfo {
  monthlyAmount: number;
  lastPaymentDate?: number;
  dueDate: number;
  isPaid: boolean;
  isOverdue: boolean;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  address: string;
  pickupLocation: string;
  dropoffLocation: string;
  onBus: boolean;
  boardedAt?: number;
  alightedAt?: number;
  payment: PaymentInfo;
}

export interface BusInfo {
  id: string;
  busNumber: string;
  driverName: string;
  capacity: number;
  route: string;
  currentLocation?: BusLocation;
  students: Student[];
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  action: 'boarded' | 'alighted';
  timestamp: number;
  location: BusLocation;
}

export interface NotificationItem {
  id: string;
  type: 'payment_overdue' | 'payment_reminder' | 'attendance' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  studentId?: string;
  studentName?: string;
}

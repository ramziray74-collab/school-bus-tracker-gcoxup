
export interface BusLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  pickupLocation: string;
  dropoffLocation: string;
  onBus: boolean;
  boardedAt?: number;
  alightedAt?: number;
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

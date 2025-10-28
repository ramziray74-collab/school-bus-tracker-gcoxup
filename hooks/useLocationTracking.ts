
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { BusLocation } from '@/types/bus';

export function useLocationTracking() {
  const [location, setLocation] = useState<BusLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkPermissions();
    return () => {
      stopTracking();
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionStatus('granted');
      } else if (status === 'denied') {
        setPermissionStatus('denied');
      } else {
        setPermissionStatus('undetermined');
      }
    } catch (error) {
      console.log('Error checking permissions:', error);
      setErrorMsg('Failed to check location permissions');
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionStatus('granted');
        setErrorMsg(null);
        return true;
      } else {
        setPermissionStatus('denied');
        setErrorMsg('Location permission denied');
        return false;
      }
    } catch (error) {
      console.log('Error requesting permissions:', error);
      setErrorMsg('Failed to request location permissions');
      return false;
    }
  };

  const startTracking = async () => {
    if (permissionStatus !== 'granted') {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      setIsTracking(true);
      setErrorMsg(null);

      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        timestamp: initialLocation.timestamp,
        speed: initialLocation.coords.speed || undefined,
        heading: initialLocation.coords.heading || undefined,
      });

      // Start watching position
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Or when moved 10 meters
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            timestamp: newLocation.timestamp,
            speed: newLocation.coords.speed || undefined,
            heading: newLocation.coords.heading || undefined,
          });
        }
      );
    } catch (error) {
      console.log('Error starting location tracking:', error);
      setErrorMsg('Failed to start location tracking');
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setIsTracking(false);
  };

  return {
    location,
    errorMsg,
    isTracking,
    permissionStatus,
    startTracking,
    stopTracking,
    requestPermissions,
  };
}

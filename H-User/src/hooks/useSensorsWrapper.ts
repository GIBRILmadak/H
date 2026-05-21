import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export const useSensorsWrapper = () => {
  const subscribeToAccelerometer = (callback: (data: any) => void) => {
    if (Platform.OS === 'web') {
      // Utiliser DeviceMotionEvent API du navigateur
      if (!('DeviceMotionEvent' in window)) {
        console.warn('DeviceMotionEvent not available on this device');
        return null;
      }

      const handler = (event: DeviceMotionEvent) => {
        if (event.accelerationIncludingGravity) {
          callback({
            x: event.accelerationIncludingGravity.x || 0,
            y: event.accelerationIncludingGravity.y || 0,
            z: event.accelerationIncludingGravity.z || 0,
          });
        }
      };

      window.addEventListener('devicemotion', handler);
      return () => {
        window.removeEventListener('devicemotion', handler);
      };
    }

    // Pour React Native
    try {
      const subscription = Accelerometer.addListener(callback);
      Accelerometer.setUpdateInterval(1000);
      return () => subscription.remove();
    } catch (error) {
      console.error('Accelerometer initialization failed:', error);
      return null;
    }
  };

  const requestDeviceMotionPermission = async () => {
    if (Platform.OS === 'web') {
      // Sur iOS 13+, besoin de permission explicite
      if (typeof (DeviceMotionEvent as any)?.requestPermission === 'function') {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          return permission === 'granted';
        } catch (error) {
          console.error('Device motion permission request failed:', error);
          return false;
        }
      }
      return true;
    }
    return true;
  };

  return { subscribeToAccelerometer, requestDeviceMotionPermission };
};

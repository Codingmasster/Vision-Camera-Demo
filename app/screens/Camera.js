import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useFrameProcessor,
  runAtTargetFps,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { useAppState } from '@react-native-community/hooks';
import { Canvas, Rect } from '@shopify/react-native-skia';
import axios from 'axios';

function CameraScreen() {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();

  const appState = useAppState();

  const [seconds, setSeconds] = useState(0);
  const [faces, setFaces] = useState([]);

  const camera = useRef(null);
  const intervalId = useRef(null);

  useEffect(() => {
    !hasPermission && requestPermission();
  }, []);

  const faceDetectionOptions = {
    landmarkMode: 'ears',
    contourMode: 'all',
    tracking: true,
    autoScale: true,
  };
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  const startTimer = () => {
    intervalId.current = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalId.current);
    setSeconds(0);
  };

  const recordVideo = () => {
    startTimer();
    camera.current.startRecording({
      maxDuration: 10,
      onRecordingFinished: (video) => {
        uploadVideo(video);
      },
      onRecordingError: (error) => {
        console.error(error);
      },
    });
  };

  const stopRecording = async () => {
    await camera.current.stopRecording();
    stopTimer();
  };

  seconds === 10 && stopRecording();

  const uploadVideo = async (video) => {
    if (!video) return;

    const formData = new FormData();
    const uri = Platform.OS === 'ios' ? video.path : 'file://' + video.path;
    formData.append('video', {
      uri: uri,
      type: 'video/mov',
      name: video.path.split('/').pop(),
    });

    try {
      const res = await axios.post(
        'http://192.168.20.225:3000/upload', // change the url according to your machine IP
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('response:', res);
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleDetectedFaces = Worklets.createRunOnJS((faces) => {
    setFaces(faces);
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      runAtTargetFps(2, () => {
        ('worklet');
        const faces = detectFaces(frame);
        handleDetectedFaces(faces);
      });
    },
    [handleDetectedFaces]
  );

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={appState === 'active'}
            video={true}
            frameProcessor={frameProcessor}
          />
          <TouchableOpacity onPress={recordVideo} style={styles.recordVideo}>
            <Text style={styles.timer}>{seconds ? seconds : ''}</Text>
          </TouchableOpacity>
          <Canvas style={StyleSheet.absoluteFill}>
            {faces.map((face, index) => {
              const xValues = [];
              const yValues = [];
              for (let obj in face.contours.FACE) {
                xValues.push(face.contours.FACE[obj].x);
                yValues.push(face.contours.FACE[obj].y);
              }
              return (
                <Rect
                  key={index}
                  x={Math.min(...xValues)}
                  y={Math.min(...yValues)}
                  width={face.bounds.width}
                  height={face.bounds.height}
                  color="red"
                  style="stroke"
                  strokeWidth={5}
                  borderRadius={50}
                />
              );
            })}
          </Canvas>
        </>
      ) : (
        <View style={styles.noPermission}>
          <Text style={styles.noPermissionText}>
            Please grant camera permissions to this app.
          </Text>
        </View>
      )}
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  recordVideo: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    zIndex: 9999,
  },
  timer: {
    fontSize: 20,
    color: '#000',
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    zIndex: 1000,
  },
  noPermission: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  noPermissionText: {
    fontSize: 22,
  },
});

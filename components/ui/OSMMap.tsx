import * as Location from 'expo-location';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MapMarker {
    id: number | string;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    color?: string;
}

export interface OSMMapProps {
    markers?: MapMarker[];
    initialRegion?: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    showsUserLocation?: boolean;
    onMarkerPress?: (markerId: number | string) => void;
    style?: any;
}

export interface OSMMapRef {
    animateToRegion: (region: { latitude: number; longitude: number; latitudeDelta?: number; longitudeDelta?: number }, duration?: number) => void;
}

const OSMMap = forwardRef<OSMMapRef, OSMMapProps>(({
    markers = [],
    initialRegion,
    showsUserLocation = false,
    onMarkerPress,
    style
}, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [mapReady, setMapReady] = useState(false);
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    useImperativeHandle(ref, () => ({
        animateToRegion: (region, duration = 1000) => {
            if (webViewRef.current) {
                webViewRef.current.injectJavaScript(`
          if (window.map) {
            window.map.flyTo([${region.latitude}, ${region.longitude}], 15, {
              animate: true,
              duration: ${duration / 1000}
            });
          }
        `);
            }
        }
    }));

    // Construct Leaflet HTML
    const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .custom-marker {
          background-color: #3b82f6;
          border-radius: 50%;
          border: 2px solid white;
          width: 20px;
          height: 20px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Initialize map
        var map = L.map('map', { zoomControl: false }).setView([${initialRegion?.latitude || 0}, ${initialRegion?.longitude || 0}], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var markersLayer = L.layerGroup().addTo(map);
        var userMarker = null;

        // Custom icon function
        function createCustomIcon(color) {
            const svgIcon = \`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="\${color || '#3b82f6'}" width="32" height="32" stroke="white" stroke-width="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
            \`;
            return L.divIcon({
                className: 'custom-pin',
                html: svgIcon,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
        }

        // Handle messages from React Native
        window.updateMarkers = function(markers) {
          markersLayer.clearLayers();
          markers.forEach(function(m) {
            var marker = L.marker([m.latitude, m.longitude], {
                icon: createCustomIcon(m.color)
            }).addTo(markersLayer);
            
            if (m.title) {
              marker.bindPopup('<b>' + m.title + '</b><br>' + (m.description || ''));
            }
            
            marker.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: m.id }));
            });
          });
        };

        window.updateUserLocation = function(lat, lng) {
            if (userMarker) {
                userMarker.setLatLng([lat, lng]);
            } else {
                var userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background-color: #2196F3; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                userMarker = L.marker([lat, lng], {icon: userIcon}).addTo(map);
            }
        };

        setTimeout(function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
        }, 500);
      </script>
    </body>
    </html>
  `;

    // Update markers when props change
    useEffect(() => {
        if (mapReady && webViewRef.current) {
            // Safe stringify for JS injection
            const markersJson = JSON.stringify(markers);
            webViewRef.current.injectJavaScript(`window.updateMarkers(${markersJson});`);
        }
    }, [markers, mapReady]);

    // Handle User Location
    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        if (showsUserLocation) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 2000,
                        distanceInterval: 10,
                    },
                    (location) => {
                        setUserLocation({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        });

                        if (mapReady && webViewRef.current) {
                            webViewRef.current.injectJavaScript(`window.updateUserLocation(${location.coords.latitude}, ${location.coords.longitude});`);
                        }
                    }
                );
            })();
        }

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [showsUserLocation, mapReady]);


    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'mapReady') {
                setMapReady(true);
            } else if (data.type === 'markerPress') {
                onMarkerPress?.(data.id);
            }
        } catch (e) {
            console.error('Map message error', e);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: leafletHTML }}
                style={styles.webview}
                onMessage={handleMessage}
                scrollEnabled={false} // Often better for embedded maps to handle gestures themselves via Leaflet
            />
            {!mapReady && (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    }
});

export default OSMMap;

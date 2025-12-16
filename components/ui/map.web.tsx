import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

export const PROVIDER_DEFAULT = null;

export const Marker = (props: any) => null;

export type MapViewProps = ViewProps & {
    provider?: any;
    initialRegion?: any;
    showsUserLocation?: boolean;
    followsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    scrollEnabled?: boolean;
    zoomEnabled?: boolean;
};

const MapView = (props: MapViewProps) => {
    return (
        <View style={[styles.container, props.style]}>
            <Text style={styles.text}>Maps are not supported on web yet.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        minHeight: 200,
    },
    text: {
        color: '#666',
    },
});

export default MapView;

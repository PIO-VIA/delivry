import { useTheme } from '@/hooks/use-theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from './icon';

interface ErrorMessageProps {
    message: string | null;
    visible: boolean;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, visible, onDismiss }) => {
    const theme = useTheme();
    const opacity = useRef(new Animated.Value(0)).current;
    const height = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible && message) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(height, {
                    toValue: 60, // Approximate height
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(height, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [visible, message]);

    if (!message && !visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.error + '15', // 15% opacity
                    borderColor: theme.colors.error + '30', // 30% opacity
                    height: height,
                    opacity: opacity,
                },
            ]}
        >
            <View style={styles.content}>
                <Icon name="alert-circle" size={20} color={theme.colors.error} />
                <Text style={[styles.text, { color: theme.colors.error }]}>
                    {message}
                </Text>
                {onDismiss && (
                    <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                        <Icon name="x" size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 16,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    text: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    closeButton: {
        padding: 4,
    }
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenAPI } from './core/OpenAPI';

export const configureApi = async () => {
    // Load token from storage on app start
    const token = await AsyncStorage.getItem('token');
    if (token) {
        OpenAPI.TOKEN = token;
    }
};

export const setApiToken = (token: string | null) => {
    if (token) {
        OpenAPI.TOKEN = token;
        AsyncStorage.setItem('token', token);
    } else {
        OpenAPI.TOKEN = undefined;
        AsyncStorage.removeItem('token');
    }
};

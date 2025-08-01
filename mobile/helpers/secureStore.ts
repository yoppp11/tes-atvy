import * as SecureStore from 'expo-secure-store';

export async function setSecure(key: string, value: string){
    return await SecureStore.setItemAsync(key, value);
}

export async function getSecure(key: string){
    return await SecureStore.getItemAsync(key)
}

export async function deleteSecure(key: string){
    return await SecureStore.deleteItemAsync(key)
}
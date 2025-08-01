import { Stack } from "expo-router";
import { View } from "react-native";

export default function TabLayout(){
    return (
        <View style={{ flex: 1 }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        </View>
    );
}
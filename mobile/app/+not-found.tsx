import { SafeAreaView, StyleSheet, Text, View } from 'react-native'; 
export default function NotFoundScreen(){
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>404 - Not Found</Text>
            <Text style={{ marginTop: 10 }}>The page you are looking for does not exist.</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});

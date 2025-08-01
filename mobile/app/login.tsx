import { axiosInstance } from "@/helpers/axios"
import { setSecure } from "@/helpers/secureStore"
import { UserResponse } from "@/helpers/types"
import { useRouter } from "expo-router"
import { useState } from "react"
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function LoginPage(){
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const navigation = useRouter()

    async function handleLogin(){
        try {
            console.log(username);
            console.log(password);
            
            const response = await axiosInstance({
                method: 'POST',
                url: '/api/login',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    username,
                    password
                }
            })

            const data: UserResponse = response.data
            const token = data.access_token
            const userId = data.id
            const userName = data.username

            await setSecure('access_token', token)
            await setSecure('user_id', userId.toString())
            await setSecure('username', userName)
            navigation.replace('/home')
        } catch (error) {
            console.log(error, '<<<====error');
            
        }
    }

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.content}>
                
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Username"
                            keyboardType="default"
                            autoCapitalize="none"
                            style={styles.input}
                            onChangeText={setUsername}
                            value={username}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </SafeAreaView>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        maxWidth: 400,
        width: '100%',
        padding: 20,
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#222',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#444',
        justifyContent: 'center',
    },
    inputWrapper: {
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        padding: 10,
    },
    input: {
        color: '#fff',
        fontSize: 16,
        padding: 10,
        borderRadius: 4,
        backgroundColor: '#444',
        borderWidth: 1,
        borderColor: '#555',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    successText: {
        color: 'green',
        marginTop: 10,
        textAlign: 'center',
    },
})
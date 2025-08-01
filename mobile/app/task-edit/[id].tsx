import { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text, Platform, Button, Alert } from "react-native";
import { axiosInstance } from "@/helpers/axios";
import { getSecure } from "@/helpers/secureStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFetchTaskById } from "@/hooks/useFetchTaskById";

export default function EditTaskScreen(){
    const [date, setDate] = useState(new Date())
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [show, setShow] = useState(false);
    const [showAler, setShowAlert] = useState(false)
    const navigation = useRouter()
    const { id } = useLocalSearchParams()

    function onChange(e: any, selectedDate?: Date) {
        setShow(Platform.OS === 'ios')
        if(selectedDate) {
            setDate(selectedDate);
        }
    }

    async function handleEditTask(){
        try {
            const token = await getSecure('access_token');

            const response = await axiosInstance({
                method: 'PUT',
                url: '/api/tasks/' + id,
                data: {
                    title,
                    description,
                    dueDate: date
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log(response);
            
            setShowAlert(true)
            Alert.alert('Success', 'Task edited successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.back();
                    }
                }
            ]);
        } catch (error) {
            console.log(error);
            
        }
    }

    async function fetchTask(id: string){
        try {
            const token = await getSecure('access_token');
            const response = await axiosInstance({
                method: 'GET',
                url: `/api/tasks/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response);

            setTitle(response.data.title);
            setDescription(response.data.description);
            setDate(new Date(response.data.dueDate));
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=> {
        if (id) {
            fetchTask(id as string);
        }
    }, [])

    return (
        <SafeAreaView style={styles.container}>
           
            <View style={styles.content}>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Title"
                    style={styles.input}
                />
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    style={styles.input}
                />
                <Button title="Pilih Tanggal" onPress={() => setShow(true)} />
                <Text style={{ marginTop: 10 }}>
                    Tanggal Dipilih: {date.toLocaleDateString('id-ID')}
                </Text>

                {show && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}

                <TouchableOpacity style={styles.button} onPress={handleEditTask}>
                    <Text style={styles.buttonText}>Edit Task</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})
import { axiosInstance } from "@/helpers/axios"
import { getSecure } from "@/helpers/secureStore"
import { Task } from "@/helpers/types"
import { Link, useRouter } from "expo-router"
import { Alert, GestureResponderEvent, StyleSheet, Text, View } from "react-native"

export default function CardContent({ task, setRefetch }: { task: Task, setRefetch: (status: boolean) => void }){
  const navigation = useRouter()

  async function handleDelete(e: GestureResponderEvent){
    e.preventDefault()
      Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getSecure('access_token');
              const response = await axiosInstance({
                method: 'DELETE',
                url: `/api/tasks/${task.id}`,
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })

              console.log(response);
              Alert.alert('Success', 'Task deleted successfully!', [
                {
                  text: 'OK',
                }
              ]);

              setRefetch(true);

            } catch (error) {
              console.log(error);
            }
          }
        }
      ])
  }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{task.title}</Text>
                <Text >{new Date(task.dueDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}</Text>
            </View>
            <View>
                <Text >{task.description}</Text>
            </View>
            <View >
                <View style={styles.buttonContainer}>
                    <Link style={styles.button} href={{
                      pathname: '/task-edit/[id]',
                      params: { id: task.id.toString() }
                    }} >Edit</Link>
                    <Text style={styles.button} onPress={handleDelete}>Delete</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
    width: '100%',
    padding: 20,
    //buat background card menjadi sedikit lebih gelap
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '60%',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: 5,
    fontSize: 14,
  },
})
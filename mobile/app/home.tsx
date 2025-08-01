import CardContent from '@/components/CardContent';
import { useFetchTask } from '@/hooks/useFetchTask';
import { FAB } from 'react-native-paper';
import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const [refetch, setRefetch] = useState(false);
  const { tasks } = useFetchTask(refetch);
  const navigation = useRouter()

  console.log(tasks);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList 
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CardContent task={item} setRefetch={setRefetch}/>}
        />
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            right: 20,
            bottom: 60,
          }}
          onPress={() => {
            navigation.push('/add-task');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingHorizontal: 20,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
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
});

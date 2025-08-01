import { axiosInstance } from "@/helpers/axios";
import { getSecure } from "@/helpers/secureStore";
import { Task } from "@/helpers/types";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export function useFetchTask(refetch: boolean) {
    const [tasks, setTasks] = useState<Task[]>([])

    async function fetchTask(){
        try {
            const token = await getSecure('access_token');

            const response = await axiosInstance({
                method: 'GET',
                url: '/api/tasks',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            // console.log(response.data);
            setTasks(response.data as Task[]);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchTask();
        }, [refetch])
    )

    return { tasks }
}
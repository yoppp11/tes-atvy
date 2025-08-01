import { axiosInstance } from "@/helpers/axios";
import { getSecure } from "@/helpers/secureStore";
import { Task } from "@/helpers/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export function useFetchTaskById(taskId: string){
    const [task, setTask] = useState<Task>();

    async function fetchTaskById(id: string){
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `/api/tasks/${id}`,
                headers: {
                    'Authorization': `Bearer ${await getSecure('access_token')}`
                }
            })

            setTask(response.data);
            console.log(response.data);
            
            
        } catch (error) {
            console.log(error);
            
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchTaskById(taskId);
        }, [taskId])
    )

 
    return { task }
}
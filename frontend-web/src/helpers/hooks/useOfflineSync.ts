import { useEffect, useState } from "react";
import { db } from "../db";
import type { PendingAction } from "../types";
import { http } from "../axiosInstance";
import Swal from "sweetalert2";

export function useOfflineSync(){
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [isSync, setIsSync] = useState(false)
    const [pendingCount, setPendingCount] = useState(0)
    
    useEffect(()=> {
        function handleOnline(){
            setIsOnline(true)
            console.log('You are online');
        }
        
        function handleOffline(){
            setIsOnline(false)
            console.log('You are offline');
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    async function loadPendingCount(){
        const count = await db.pendingActions.count()
        setPendingCount(count)
    }

    async function addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>){
        await db.pendingActions.add({
            ...action,
            timestamp: new Date()
        })
        loadPendingCount()
    }

    async function syncPendingActions(){
        if(!isOnline || isSync) return

        setIsSync(true)
        try {
            const actions = await db.pendingActions.orderBy('timestamp').toArray()

            for(const action of actions){
                try {
                    switch(action.type){
                        case 'CREATE':
                            if(action.taskData){
                                const response = await http({
                                    method: 'post',
                                    url: '/tasks',
                                    data: {
                                        title: action.taskData.title,
                                        description: action.taskData.description,
                                        dueDate: action.taskData.dueDate
                                    },
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                                    }
                                })

                                if(action.taskData.tempId){
                                    await db.tasks.where('tempId').equals(action.taskData.tempId).modify({
                                        id: response.data.id,
                                        isLocal: false,
                                        tempId: undefined
                                    })
                                }
                            }
                            break
                        case 'UPDATE':
                            if(action.taskId && action.taskData){
                                await http({
                                    method: 'put',
                                    url: `/tasks/${action.taskId}`,
                                    data: {
                                        title: action.taskData.title,
                                        description: action.taskData.description,
                                        dueDate: action.taskData.dueDate
                                    },
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                                    }
                                })

                                await db.tasks.where('id').equals(action.taskId).modify({
                                    isModified: false
                                })
                            }
                            break
                        case 'DELETE':
                            if(action.taskId){
                                await http({
                                    method: 'delete',
                                    url: `/tasks/${action.taskId}`,
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                                    }
                                })
                            }
                            break
                    }

                    if(action.id){
                        await db.pendingActions.delete(action.id)
                    }
                } catch (error) {
                    console.log(`Failed to sync action ${action.id}:`, error);
                }
                
            }

            loadPendingCount()

            if (actions.length > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sync Complete',
                    text: `${actions.length} actions synchronized successfully`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.log('Failed to load pending actions:', error);
            Swal.fire({
                icon: 'error',
                title: 'Sync Failed',
                text: 'Some actions could not be synchronized. Will retry when online.',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSync(false)
        }
    }

    return {
        isOnline,
        isSync,
        pendingCount,
        addPendingAction,
        syncPendingActions,
        loadPendingCount
    }
}
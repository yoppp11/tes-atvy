import { getSecure } from "@/helpers/secureStore";
import { useEffect, useState } from "react";

export function useCheckAuth(){
    const [isAuthenticated, setIsAutenticated] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    async function chechAuth(){
        const token = await getSecure('access_token')
        
        if(!token) {
            setIsAutenticated(false)
            setLoading(false)
            return
        }
        else {
            setIsAutenticated(true)
            setLoading(false)
            return
        }
    }

    useEffect(()=> {
        chechAuth();
    }, [])

    return { isAuthenticated, loading }
}
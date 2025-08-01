import { useState } from "react"
import Swal from "sweetalert2"
import { http } from "../helpers/axiosInstance"
import axios from "axios"
import type { User } from "../helpers/types"
import { useNavigate } from "react-router"

export default function LoginPage(){
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await http({
                method: 'post',
                url: '/login',
                data: {
                    username: formData.username,
                    password: formData.password
                }
            })

            const user: User = response.data

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome, ${user.username}!`,
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.setItem('access_token', response.data.access_token)
                navigate('/home')
            })

        } catch (error) {
            console.log(error, '<======');

            let errorMessage = 'An error occurred during login'

            if(axios.isAxiosError(error)){
                if(error.response && error.response.data){
                    errorMessage = error.response.data.message || 'An error occurred during login'
                } else {
                    errorMessage = 'Network error, please try again later'
                }
            }

            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                confirmButtonText: 'OK'
            })
        }
    }   

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="min-h-screen min-w-screen flex flex-col justify-center items-center">
            <div className="w-120 flex justify-center items-center bg-gray-500 rounded-2xl">
                <div className="flex flex-col justify-start min-w-md mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-4 font-sans text-center">Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
                            <input type="text" id="username" className="w-full px-3 py-2 border rounded" value={formData.username} onChange={handleChange} name="username"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                            <input type="password" id="password" className="w-full px-3 py-2 border rounded" value={formData.password} onChange={handleChange} name="password"/>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
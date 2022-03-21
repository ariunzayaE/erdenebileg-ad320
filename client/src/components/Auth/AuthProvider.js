import React, { useState } from 'react'
import axios from 'axios'
import jwt from 'jwt-decode'

const AuthContext = React.createContext(null)

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null)

    const login = async (email, password, callback) => { 
        console.log("[Login]")
        try{
            const authResponse = await axios.post(
                'http://localhost:8000/auth/login', 
                { email: email, password: password }, 
                { 'content-type': 'application/json' }
            )
            const decoded = jwt(authResponse.data.token)
            setAuth({ token: authResponse.data.token, user: decoded.user })
            callback()
        } catch (err) {
            console.log(`Login error ${err}`)
            // Assignment: what should we do if this fails?
            alert('Login failed. Please try again.')
            
        }
    }

    const register = async (email, password, callback) => { 
        console.log("[Register]")
        console.log(email, password)
        try{
            const regResponse = await axios.post(
                'http://localhost:8000/auth/register', 
                { email: email, password: password }, 
                { 'content-type': 'application/json' }
            )
            //const regToken = regResponse.data.token
            console.log("String test", regResponse.data)
            setAuth({ token: regResponse.data.token, user: regResponse.data.user })
            callback()
        } catch (err) {
            console.log(`Register error ${err}`)
            alert('Register failed. Please try again.')
        }
    }

    const authCtx = {
        auth: auth,
        login: login,
        register: register
    }

    return (
        <AuthContext.Provider value={authCtx}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const authContext = React.useContext(AuthContext)
    return authContext
}

export default AuthProvider
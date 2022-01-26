import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/firebase'
import { CircularProgress as Spinner } from '@mui/material'

export const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState('')
    const [loading, setLoading] = useState(true)
    function signUp(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }
    function logout() {
        return auth.signOut()
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])
    const value = {
        currentUser,
        signUp,
        login,
        logout,
        updatePassword,
        updateEmail
    }
    return (
        <AuthContext.Provider value={value}>
            {loading ? <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner color="inherit" size={250} />
            </div> : children}
        </AuthContext.Provider>
    )
}

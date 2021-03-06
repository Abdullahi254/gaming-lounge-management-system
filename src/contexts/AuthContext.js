import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/firebase'
import { CircularProgress as Spinner } from '@mui/material'
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    sendPasswordResetEmail,
    updateProfile,
    sendEmailVerification 
} from 'firebase/auth'

export const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState('')
    const [loading, setLoading] = useState(true)
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    function logout() {
        return signOut(auth)
    }

    function updateUserPassword(password) {
        return updatePassword(auth.currentUser, password)
    }

    function updateUserEmail(email) {
        return updateEmail(auth.currentUser, email)
    }

    function updateUserName(name) {
        return updateProfile(auth.currentUser, {
            displayName: name
        })
    }

    function updateUserDp(url){
        return updateProfile(auth.currentUser,{
            photoURL:url
        })
    }

    function passwordResetByMail(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function getCredentials(email, password) {
        return EmailAuthProvider.credential(
            email,
            password
        );
    }
    function reauthenticate(credential) {
        return reauthenticateWithCredential(auth.currentUser, credential)
    }
    function sendUserVerification () {
        return sendEmailVerification(auth.currentUser)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
            user.getIdTokenResult().then(idTokenResult=>{
                const last = new Date(idTokenResult.claims.auth_time * 1000);
                console.log("Last log in ",last.toLocaleString())
                const now = new Date()
                const diff = now.getTime() - last.getTime()
                const sessionDuration = (1000 * 60 * 60 * 8)
                console.log("logged in for", Math.round(diff/(1000*60)), "mins")
                if(diff >= sessionDuration ){
                    auth.signOut()
                }else{
                    setTimeout(()=>{
                        auth.signOut()
                    }, (sessionDuration - diff))
                }
            })
        })

        return unsubscribe
    }, [])
    const value = {
        currentUser,
        signUp,
        login,
        logout,
        updateUserPassword,
        updateUserEmail,
        passwordResetByMail,
        getCredentials,
        reauthenticate,
        updateUserName,
        updateUserDp,
        sendUserVerification
    }
    return (
        <AuthContext.Provider value={value}>
            {loading ? <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner color="inherit" size={250} />
            </div> : children}
        </AuthContext.Provider>
    )
}

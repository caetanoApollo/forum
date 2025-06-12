import React, { createContext, useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
// npx expo install @react-native-async-storage/async-storage

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const signIn = async (token, userData) => {
        try {
            await AsyncStorage.setItem('userToken', token)
        } catch (e) {
            console.error('Erro ao salvar token/dados no AsyncStorage', e)
        }
    }
}
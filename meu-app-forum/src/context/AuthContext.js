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

    const signOut = async () => {
        try {
            console.log('AuthContext: iniciando signOut(). Removendo Token')
            await AsyncStorage.removeItem('userToken')
            setUserToken(null)
            console.log('AuthContext: Token removido com sucesso')
        } catch (e) {
            console.error('Erro ao remover token do AsyncStorage', e)
        }
    }

    // função para carregar o token do AsyncStorage
    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorege.getItem('userToken')
                if (token) {
                    setUserToken(token)
                }
            } catch (e) {
                console.error('Erro ao carregar token do AsyncStorage', e)
            } finally {
                setIsLoading(false)
            }
        }

        loadToken()
    }, [])

    return (
        <AuthContext.Provider value={{ userToken, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext
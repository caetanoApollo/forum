import React, {useEffect, useContext} from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import api from "../api/api";
import AuthContext from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', {
                identifier,
                password
            })
            Alert.alert('Sucesso!', 'Login realizado com sucesso.')
            // chamar signIn para salvar/atualizar o token
            await signIn(response.data.token, response.data.user)
            // não preciso redirecionar pois o appnavigator já o faz
        } catch (e) {
            console.error('Erro no login:', e.response?.data || e.message);
            Alert.alert('Erro', 'Não foi possível realizar o login. Verifique suas credenciais e tente novamente.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem Vindo!</Text>
            <TextInput
                style={styles.input}
                placeholder="Email ou Nome de Usuário"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Entrar" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    )
}
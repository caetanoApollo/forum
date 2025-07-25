import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {View, ActivityIndicator} from 'react-native'

import AuthStack from "./screens/AuthStack"
import HomeScreen from "./screens/HomeScreen"
import PostScreen from "./screens/PostScreen"
import AuthContext from "./context/AuthContext"
import ProfileScreen from "./screens/ProfileScreen"
import PostDetailScreen from "./screens/PostDetailScreen"
import EditProfileScreen from "./screens/EditProfileScreen"

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
    const { userToken, isLoading } = React.useContext(AuthContext)

    if (isLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {userToken ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Post" component={PostScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator
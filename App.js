import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import SplashScreen from "./book/splashscreen";
import { MyStack } from "./book/common/MyStack";
import { Header } from "./book/common/header";
import BookInfo from "./book/bookinfo";
import BookRead from "./book/BookRead";
import Login from "./book/Login";
import SignUp from "./book/SignUp";
import AuthorInfo from "./book/AuthorInfo";
import Genres from "./book/Genres";
import Terms from "./book/Settings/Terms";
import PrivacyPolicy from "./book/Settings/PrivacyPolicy";
import About from "./book/Settings/About";
import Feedback from "./book/Settings/Feedback";
import BookIcon from "./assets/appicon.svg";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Books from "./book/Library/Books";

// import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyStack"
          component={MyStack}
          options={{
            headerShown: true,
            headerTitle:"",
            headerStyle:{height: responsiveHeight(12)},
            headerLeft: () => <Header headerTitle="BookAtEase" />,
          }}
        />
        <Stack.Screen
          name="BookInfo"
          component={BookInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookRead"
          component={BookRead}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Genre"
          component={Genres}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuthorInfo"
          component={AuthorInfo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

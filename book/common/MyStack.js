// navigate from one screen to another
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LatestBook from "../latest";
import Library from "../library";
import Setting from "../setting";
import Collection from "../collection";
import BookInfo from "../bookinfo";
import Latest from '../../assets/online-learning.svg';
import LibraryIcon from '../../assets/library-book.svg';
import CollectionIcon from '../../assets/book.svg';
import SettingsIcon from '../../assets/settings.svg';
import LatestSelected from '../../assets/online-learning-selected.svg';
import LibrarySelected from '../../assets/library-book-selected.svg';
import CollectionSelected from '../../assets/book-selected.svg';
import SettingsSelected from '../../assets/settings-selected.svg';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const MyStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Library"
      tabBarOptions={{
        activeTintColor: "#e91e63",
        inactiveTintColor: "grey",
        labelStyle: { fontWeight: "bold", fontSize: 16 },
        style: {height: 70, justifyContent: "center", padding: 10, paddingBottom: 10}
      }}
    >
      <Tab.Screen
        name="LatestBook"
        component={LatestBook}
        options={{
          tabBarLabel: "Latest",
          tabBarIcon: ({focused}) => (
            focused ?
            <LatestSelected height={24} width={24}/>
            : <Latest height={24} width={24}/>
          )
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="home" color={color} size={size} />
          // ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          tabBarLabel: "Library",
          tabBarIcon: ({focused}) => (
            focused ?
            <LibrarySelected height={24} width={24}/>
            : <LibraryIcon height={24} width={24}/>
          )
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="bell" color={color} size={size} />
          // ),
        }}
      />
      <Tab.Screen
        name="Collection"
        component={Collection}
        options={{
          tabBarLabel: "Collection",
          tabBarIcon: ({focused}) => (
            focused ?
            <CollectionSelected height={24} width={24}/>
            : <CollectionIcon height={24} width={24}/>
          )
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="account" color={color} size={size} />
          // ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({focused}) => (
            focused ?
            <SettingsSelected height={24} width={24}/>
            : <SettingsIcon height={24} width={24}/>
          )
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="account" color={color} size={size} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
};

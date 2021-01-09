// navigate from one screen to another
import React , { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Library from '../library';
import BookInfo from '../bookinfo';
import LatestBook from '../latest';

const Stack = createStackNavigator();

export const MyNav = () => {
  return (
        <Stack.Navigator initialRouteName="LatestBook" headerMode="none"
         option={{headerShown : false}}>
            <Stack.Screen name="LatestBook" component={LatestBook} />  
            <Stack.Screen name="BookInfo" component={BookInfo} />
        </Stack.Navigator>
  );
}
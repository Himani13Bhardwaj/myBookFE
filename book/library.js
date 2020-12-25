import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Books from "./Library/Books";
import GenresTab from "./Library/GenresTab";
import AuthorsTab from "./Library/AuthorsTab";

const Library = createMaterialTopTabNavigator();

function LibrayTabs() {
  return (
    <Library.Navigator
      tabBarOptions={{
        activeTintColor: "#ffffff",
        inactiveTintColor: "#e5e5e5",
        style: {
          backgroundColor: "#e91e63",
          elevation: 0,
          justifyContent: "center",
        },
        labelStyle: {
          fontSize: 13,
          fontWeight: "bold",
        },
        indicatorStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Library.Screen name="Books" component={Books}/>
      <Library.Screen name="Genres" component={GenresTab} />
      <Library.Screen name="Authors" component={AuthorsTab} />
    </Library.Navigator>
  );
}

export default LibrayTabs;

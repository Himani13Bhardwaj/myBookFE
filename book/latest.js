import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Latest from "./Latest/Latest";
import Deals from "./Latest/Deals";

const LatestTab = createMaterialTopTabNavigator();

function LatestTabs() {
  return (
    <LatestTab.Navigator
      tabBarOptions={{
        activeTintColor: "#ffffff",
        inactiveTintColor: "#e5e5e5",
        style: {
          backgroundColor: "#e91e63",
          elevation: 0,
          marginTop: 30,
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
      <LatestTab.Screen name="Latest" component={Latest}/>
      <LatestTab.Screen name="Deals" component={Deals} />
    </LatestTab.Navigator>
  );
}

export default LatestTabs;

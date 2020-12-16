import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ReadingBooks from "./Collection/ReadingBooks";
import RecentBooks from "./Collection/RecentBooks";

const CollectionTab = createMaterialTopTabNavigator();

function Collection() {
  return (
    <CollectionTab.Navigator
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
      <CollectionTab.Screen name="ReadingBooks" component={ReadingBooks}/>
      <CollectionTab.Screen name="RecentBooks" component={RecentBooks} />
    </CollectionTab.Navigator>
  );
}

export default Collection;

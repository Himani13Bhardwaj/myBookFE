import React, { Component } from "react";

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import BookIcon from "../../assets/appicon.svg";
import LeftArrow from "../../assets/left-arrow.svg";

export const Header = (props) => {
  return (
    <View style={styles.headerContainer}>
    {props.backBtnVisible == true ? 
    <TouchableOpacity onPress={props.onBackBtnPress}>
      <View
        style={{
          width: 35,
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 100,
          backgroundColor: "transparent",
        }}
      >
        
        <LeftArrow height={25} width={25} /> 
      </View> 
      </TouchableOpacity>
      :
      <View
        style={{
          width: 35,
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 100,
          backgroundColor: "#fff",
        }}
      >
        
        <BookIcon height={25} width={25} /> 
      </View>}
      <Text style={styles.headerLabel}>{props.headerTitle}</Text>
      {/* <Image source={
            {uri : "https://www.freeiconspng.com/uploads/book-icon-1.png"}  
            } */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingHorizontal: 20,
    width: responsiveWidth(100),
    backgroundColor: "#e91e63",
    alignItems: "center",
  },
  headerLabel: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 20,
    marginTop: 3,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginLeft: 10,
    borderRadius: 20,
  },
});

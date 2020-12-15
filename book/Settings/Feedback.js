import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Button,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Header } from "../../book/common/header";
import Constants from "expo-constants";
import axios from "axios";
import Error from "../../assets/error.svg";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import AnimatedLoader from "react-native-animated-loader";
import { WebView } from "react-native-webview";

class Feedback extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerTitle={"Feedback"}
          backBtnVisible={true}
          onBackBtnPress={() => this.props.navigation.goBack()}
        />
        <View style={{
            width: responsiveWidth(90),
            height: 200,
            borderRadius: 5,
            borderWidth: 1,
            marginVertical: 20,
            padding: 10,
            alignItems: "flex-start",}}>
        <TextInput
          style={{
            width: responsiveWidth(85),
          }}
          multiline={true}
          placeholder="Your Feedback"
        />
        </View>
        <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack()
            }}
          >
            <View
              style={{
                width: responsiveWidth(90),
                backgroundColor: "#e91e63",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                padding: 10,
                margin: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Submit
              </Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  tinyLogo: {
    width: responsiveWidth(35),
    height: responsiveHeight(20),
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Feedback;

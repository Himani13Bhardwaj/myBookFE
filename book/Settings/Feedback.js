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
  ToastAndroid,
} from "react-native";
import { Header } from "../../book/common/header";
import Constants from "expo-constants";
import Error from "../../assets/error.svg";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import AnimatedLoader from "react-native-animated-loader";
import { WebView } from "react-native-webview";
import axios from "axios";
import * as Constant from "../common/constants";
import AsyncStorage from "@react-native-community/async-storage";

class Feedback extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      feedback: ""
    };
  }

  async submitFeedback() {
    const data = new FormData()

    data.append("email",await AsyncStorage.getItem("email"))
    data.append("comment",this.state.feedback)

    console.log("data", data)

    axios
      .post(Constant.feedbackApi, data)
      .then((response) => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        this.props.navigation.goBack();
      })
      .catch((e) => {
        console.log("err", e);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerTitle={"Feedback"}
          backBtnVisible={true}
          onBackBtnPress={() => this.props.navigation.goBack()}
        />
        <View
          style={{
            width: responsiveWidth(90),
            height: 200,
            borderRadius: 5,
            borderWidth: 1,
            marginVertical: 20,
            padding: 10,
            alignItems: "flex-start",
          }}
        >
          <TextInput
            style={{
              width: responsiveWidth(85),
            }}
            multiline={true}
            placeholder="Your Feedback"
            onChangeText={(text) =>
              this.setState({
                feedback: text,
              })
            }
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.state.feedback != ""
              ? this.submitFeedback()
              : ToastAndroid.show("Please write something", ToastAndroid.SHORT);
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
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
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

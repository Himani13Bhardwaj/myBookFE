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

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width'>
  <title>About App</title>
  <style> body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding:1em; } </style>
</head>
<body><p>
              <strong>Who thought you can earn coins for reading your favourite book.</strong><br><br>

              BookAtEase is a free app where you can read book of your choice and earns coins as well while reading the book.
              You can search book of your choice or you can even search your favourite author and read their books at ease.
            </p> <p>
</body>
</html>`;

class About extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerTitle={"About App"}
          backBtnVisible={true}
          onBackBtnPress={() => this.props.navigation.goBack()}
        />
        <WebView
          source={{ html: htmlContent }}
          style={{ width: responsiveWidth(100), height: responsiveHeight(90) }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default About;

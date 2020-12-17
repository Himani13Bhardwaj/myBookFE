import AsyncStorage from "@react-native-community/async-storage";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Button,
  Text,
  StatusBar,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export default class SplashScreen extends React.Component {
  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");

    // if (token != undefined && token != null) {
      setTimeout(() => {
        this.props.navigation.replace("MyStack");
      }, 2000);
    // } 
    // else {
    //   setTimeout(() => {
    //     this.props.navigation.navigate("Login");
    //   }, 2000);
    // }
  }

  render() {
    return (
      <View style={styles.container}>
<<<<<<< HEAD
        <Image style={{width: 200, height: 200, resizeMode: "contain"}} source={require('../assets/logo.png')} />
=======
        <Image style={{width: 300, height: 300, resizeMode: "contain"}} source={require('../assets/logos/logo.png')} />
>>>>>>> c5d76dc1637d44e25d829a587fbe7d41b9cfded9
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

import React from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, ToastAndroid } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import axios from "axios";
import * as Constants from '../book/common/constants';
import AsyncStorage from "@react-native-community/async-storage";
import AnimatedLoader from "react-native-animated-loader";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      visible: false,
    };
  }

  showMsg(msg) {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  }

  login() {
    this.setState({
      visible: true
    })
    const data = {
        username: this.state.email,
        password: this.state.password,
    }
    try {
      axios.post(Constants.loginApi, data) 
      .then(response => {
          console.log("[Login response]",response.data)
          this.setState({
            visible: false
          })
          if (response.data.response == "Error") {
              // this.setState({visible: false})
              ToastAndroid.show(response.data.error_message, ToastAndroid.SHORT)
          } else {
              AsyncStorage.setItem('token', response.data.token)
              AsyncStorage.setItem('email', response.data.email)
              this.props.navigation.replace('MyStack')
          }
      })
      .catch(error => {
        this.showMsg(error)
      })
    } catch (e) {
      console.log('error : ' + e);
    }
    
}

  checkValidations() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.email == "") {
        this.showMsg("Email cannot be empty")
      return false;
    } else if (!re.test(this.state.email.toLowerCase())) {
        this.showMsg("Invalid Email")
      return false;
    } else if (this.state.password == "") {
        this.showMsg("Password cannot be empty")
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <AnimatedLoader
        visible={this.state.visible}
        overlayColor="rgba(255,255,255,0.75)"
        source={require("../assets/loader.json")}
        animationStyle={{width: 300, height: 300}}
        speed={1}
      />
        <Text
          style={{
            fontWeight: "bold",
            color: "#e91e63",
            margin: 50,
            fontSize: 24,
          }}
        >
          LOGIN
        </Text>
        <TextInput
          placeholder="Enter Email"
          onChangeText={(text) => this.setState({ email: text })}
          style={{
            width: responsiveWidth(90),
            borderWidth: 1,
            padding: 10,
            borderColor: "#e91e63",
            borderRadius: 10,
          }}
        />
        <TextInput
          placeholder="Enter Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
          style={{
            width: responsiveWidth(90),
            borderWidth: 1,
            padding: 10,
            borderColor: "#e91e63",
            borderRadius: 10,
            marginTop: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            if (this.checkValidations()) {
              this.login()
            }
            {/* this.props.navigation.navigate('MyStack') */}
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
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Login</Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text>New User ? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={{ fontWeight: "bold", color: "#e91e63" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('MyStack')}>
            <Text style={{ marginTop: 20, fontWeight: "bold", color: "gray" }}>
              Enter as Guest
            </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

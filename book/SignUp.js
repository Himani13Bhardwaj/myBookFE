import React from "react";
import { Text, TextInput, ToastAndroid, TouchableOpacity, View,Image } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import axios from "axios";
import * as Constants from '../book/common/constants';
import AnimatedLoader from "react-native-animated-loader";
import AsyncStorage from "@react-native-community/async-storage";
import { FontAwesome } from "@expo/vector-icons";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      password2: "",
      visible: false,
      passwordVisible: false,
      rePasswordVisible: false
    };
  }

  showMsg(msg) {
    
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  }

  signUp() {
      const data = {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          password2: this.state.password2,
      }

      this.setState({
        visible: true
      })

      axios.post(Constants.registerApi, data) 
        .then(response => {
            console.log(response.data)
            this.setState({
              visible: false
            })
            if (response.data.response == "Error") {
                this.showMsg(response.data.error_message)
            } else {
              AsyncStorage.setItem('token', response.data.token)
                this.props.navigation.replace('MyStack')
            }
        })
  }

  checkValidations() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.username == "") {
        this.showMsg("Name cannot be empty")
      return false;
    } else if (this.state.email == "") {
        this.showMsg("Email cannot be empty")
      return false;
    } else if (!re.test(this.state.email.toLowerCase())) {
        this.showMsg("Invalid Email")
      return false;
    } else if (this.state.password == "") {
        this.showMsg("Password cannot be empty")
      return false;
    } else if (this.state.password2 == "") {
        this.showMsg("Re-enter your Password")
      return false;
    } else if (this.state.password != this.state.password2) {
        this.showMsg("Password does not matches")
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Image style={{width: 150, height: 150, resizeMode: "contain"}} source={require('../assets/logo.png')} />
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
            marginBottom: 10,
            fontSize: 24,
          }}
        >
          SIGN UP
        </Text>
        <TextInput
          placeholder="Enter Name"
          onChangeText={(text) => this.setState({ username: text })}
          style={{
            width: responsiveWidth(90),
            borderWidth: 1,
            padding: 10,
            borderColor: "#e91e63",
            borderRadius: 10,
          }}
        />
        <TextInput
          placeholder="Enter Email"
          onChangeText={(text) => this.setState({ email: text })}
          style={{
            width: responsiveWidth(90),
            borderWidth: 1,
            padding: 10,
            marginTop: 10,
            borderColor: "#e91e63",
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            width: responsiveWidth(90),
            borderWidth: 1,
            padding: 10,
            borderColor: "#e91e63",
            borderRadius: 10,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Enter Password"
            secureTextEntry={!this.state.passwordVisible}
            onChangeText={(text) => this.setState({ password: text })}
            style={{ width: responsiveWidth(78) }}
          />
          {this.state.passwordVisible ? (
            <FontAwesome
              onPress={() =>
                this.setState({ passwordVisible: !this.state.passwordVisible })
              }
              name="eye-slash"
              size={18}
              color="gray"
            />
          ) : (
            <FontAwesome
              onPress={() =>
                this.setState({ passwordVisible: !this.state.passwordVisible })
              }
              name="eye"
              size={18}
              color="gray"
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: responsiveWidth(90),
            borderWidth: 1,
            padding: 10,
            borderColor: "#e91e63",
            borderRadius: 10,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Enter Password"
            secureTextEntry={!this.state.rePasswordVisible}
            onChangeText={(text) => this.setState({ password2: text })}
            style={{ width: responsiveWidth(78) }}
          />
          {this.state.rePasswordVisible ? (
            <FontAwesome
              onPress={() =>
                this.setState({ rePasswordVisible: !this.state.rePasswordVisible })
              }
              name="eye-slash"
              size={18}
              color="gray"
            />
          ) : (
            <FontAwesome
              onPress={() =>
                this.setState({ rePasswordVisible: !this.state.rePasswordVisible })
              }
              name="eye"
              size={18}
              color="gray"
            />
          )}
        </View>
       

        <TouchableOpacity
          onPress={() => {
            if (this.checkValidations()) {
              this.signUp()
            }
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
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Sign Up</Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text>Already have an account ? </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={{ fontWeight: "bold", color: "#e91e63" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

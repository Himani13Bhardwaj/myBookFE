import AsyncStorage from "@react-native-community/async-storage";
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
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Header } from "../book/common/header";
import Coin from "../assets/rupee.svg";
import Error from "../assets/error.svg";
import AboutApp from "../assets/information.svg";
import Love from "../assets/love.svg";
import Privacy from "../assets/privacy-policy.svg";
import Terms from "../assets/terms-and-conditions.svg";
import Email from "../assets/email.svg";
import Profile from "../assets/man.svg";
import Login from "../assets/login.svg";
import Constants from "expo-constants";
import axios from "axios";
import * as Constant from "../book/common/constants";
import AnimatedLoader from "react-native-animated-loader";

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: "email",
      username: "Username",
      coinsCount: 0,
      loggedIn: "",
      visible: false,
      readTimer: "0",
    };
  }

  async componentDidMount() {
    this.setState({
      token: await AsyncStorage.getItem("token"),
      readTimer: await AsyncStorage.getItem("readTimer"),
    });
    if (
      (await AsyncStorage.getItem("token")) != undefined &&
      (await AsyncStorage.getItem("token")) != null
    ) {
      this.userProfile();
    }
  }

  async userProfile() {
    this.setState({
      visible: true,
    });
    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };

    axios
      .get(Constant.userProfileApi, { headers: headers })
      .then((response) => {
        console.log("[userprofile]", response.data);
        // ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        this.setState({
          emailId: response.data.user.email,
          username: response.data.user.username,
          coinsCount: response.data.userprofile.coins,
          loggedIn: response.data.userprofile.logged_date,
          visible: false,
        });
      })
      .catch((e) => {
        this.setState({
          visible: true,
        });
      });
  }

  async claimCoins(coins) {
    this.setState({
      coinsCount: this.state.coinsCount + coins,
      visible: true,
    });

    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };

    const data = {
      coins: coins,
    };

    axios
      .patch(Constant.claimCoinsApi, data, { headers: headers })
      .then((response) => {
        console.log(response.data);
        this.setState({
          visible: false,
        });
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        AsyncStorage.setItem("readTimer", "0")
      })
      .catch((e) => {
        console.log("error:", e);
        this.setState({
          visible: false,
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerTitle="Settings" />
        <Image
          source={require("../assets/background.jpg")}
          style={{
            width: responsiveWidth(100),
            height: responsiveHeight(100),
            marginTop: Constants.statusBarHeight,
            resizeMode: "contain",
            opacity: 0.2,
            top: -200,
            position: "absolute",
            zIndex: -1,
          }}
        />
        <AnimatedLoader
          visible={this.state.visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("../assets/loader.json")}
          animationStyle={{ width: 300, height: 300 }}
          speed={1}
        />
        <View style={{ flexDirection: "row", alignItems: "center", width: responsiveWidth(90), }}>
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              padding: 10,
              marginTop: 20,
              backgroundColor: "#fff",
            }}
          >
            <Profile height={40} width={40} />
          </View>
          <Text
            style={{
              color: "#000",
              fontSize: 24,
              marginTop: 20,
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            {this.state.token != null && this.state.token != undefined
              ? this.state.username
              : "Guest"}
          </Text>
        </View>

        <View
          style={{
            width: responsiveWidth(100),
            height: responsiveHeight(70),
            position: "absolute",
            bottom: 0,
            backgroundColor: "#fff",
            borderTopStartRadius: 40,
            borderTopEndRadius: 40,
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: "gray",
          }}
        >
          <View
            style={{
              width: 100,
              height: 5,
              borderRadius: 10,
              alignSelf: "center",
              backgroundColor: "#e91e63",
            }}
          />
          {this.state.token != null && this.state.token != undefined ? (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: responsiveWidth(90),
                  alignSelf: "center",
                  padding: 10,
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Email height={20} width={20} />
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                  >
                    Email
                  </Text>
                </View>
                <Text style={{ fontSize: 16 }}>{this.state.emailId}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: responsiveWidth(90),
                  alignSelf: "center",
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Coin height={20} width={20} />
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                  >
                    Coins
                  </Text>
                </View>
                <Text style={{ fontSize: 16 }}>{this.state.coinsCount}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: responsiveWidth(90),
                  alignSelf: "center",
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Coin height={20} width={20} />
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                  >
                    Claim Coins
                  </Text>
                </View>
                
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: responsiveWidth(40),
                  }}
                >
                {this.state.readTimer == "15" ?
                  <TouchableOpacity
                    onPress={() => this.claimCoins(15)}
                  >
                    <View
                      style={{
                        borderRadius: 60,
                        backgroundColor: "#e91e63",
                        padding: 10,
                        paddingVertical: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#fff",
                        }}
                      >
                        Claim 15 Coins
                      </Text>
                    </View>
                  </TouchableOpacity> : null}
                  {this.state.readTimer == "30" ?
                  <TouchableOpacity
                    disabled={this.state.readTimer != "30"}
                    onPress={() => this.claimCoins(30)}
                  >
                    <View
                      style={{
                        borderRadius: 60,
                        backgroundColor:
                          this.state.readTimer == "30" ? "#e91e63" : "gray",
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        30
                      </Text>
                    </View>
                  </TouchableOpacity> : null }
                  {this.state.readTimer == "60" ?
                  <TouchableOpacity
                    disabled={this.state.readTimer != "60"}
                    onPress={() => this.claimCoins(60)}
                  >
                    <View
                      style={{
                        borderRadius: 60,
                        backgroundColor:
                          this.state.readTimer == "60" ? "#e91e63" : "gray",
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        60
                      </Text>
                    </View>
                  </TouchableOpacity> : null }
                  {this.state.readTimer != "15" && this.state.readTimer != "30" && this.state.readTimer != "60" ?
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Error width={16} height={16}/>
                    <Text style={{color:"gray", marginLeft: 5}}>No Coins to Claim</Text>
                    </View>: null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Feedback")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: responsiveWidth(90),
                    alignSelf: "center",
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Love height={20} width={20} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Feedback
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("About")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: responsiveWidth(90),
                    alignSelf: "center",
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AboutApp height={20} width={20} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      About App
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: responsiveWidth(90),
                    alignSelf: "center",
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Privacy height={20} width={20} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Terms")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: responsiveWidth(90),
                    alignSelf: "center",
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Terms height={20} width={20} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Terms & Conditions
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: responsiveWidth(90),
                  alignSelf: "center",
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Login height={20} width={20} />
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                  >
                    Last Logged In
                  </Text>
                </View>
                <Text style={{ fontSize: 16 }}>{this.state.loggedIn}</Text>
              </View> */}
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                height: responsiveHeight(40),
                width: responsiveWidth(100),
              }}
            >
              <Error height={50} width={50} />
              <Text style={{ fontSize: 16, marginTop: 10 }}>
                Please Login to Continue
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={{ position: "absolute", bottom: 10 }}
            onPress={() => {
              AsyncStorage.clear();
              this.props.navigation.reset({
                routes: [{ name: "Login" }],
              });
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
                {this.state.token != null && this.state.token != undefined
                  ? "Logout"
                  : "Login"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    marginTop: Constants.statusBarHeight,
    alignItems: "center",
  },
});

export default Setting;

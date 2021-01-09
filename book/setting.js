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
import { Ionicons } from "@expo/vector-icons";

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
    });
    if (
      (await AsyncStorage.getItem("token")) != undefined &&
      (await AsyncStorage.getItem("token")) != null
    ) {
      this.userProfile();
    }

    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      this.setState({
        readTimer: await AsyncStorage.getItem("readTimer"),
      });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
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
        this.setState({
          readTimer: 0,
        });
        AsyncStorage.setItem("readTimer", "0");
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
        <Image
          source={require("../assets/background.jpg")}
          style={{
            width: responsiveWidth(100),
            height: responsiveHeight(100),
            opacity: 0.08,
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: responsiveWidth(90),
            marginVertical: responsiveHeight(5),
          }}
        >
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              padding: 10,
              backgroundColor: "#fff",
            }}
          >
            <Profile height={40} width={40} />
          </View>
          <View
            style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 24,
                marginLeft: 10,
                fontWeight: "bold",
              }}
            >
              {this.state.token != null && this.state.token != undefined
                ? this.state.username
                : "Guest"}
            </Text>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
              }}
            >
              {this.state.emailId}
            </Text>
          </View>
        </View>
        {this.state.token != null && this.state.token != undefined ? (
          <View>
            <View
              style={{
                width: responsiveWidth(90),
                padding: 10,
                borderRadius: 10,
                elevation: 3,
                backgroundColor: "#fff",
              }}
            >
              <View
                style={{
                  width: responsiveWidth(80),
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <Text style={{ color: "#e91e63", fontWeight: "bold" }}>
                  Balance
                </Text>
                <Text style={{ color: "#e91e63", fontWeight: "bold" }}>
                  {this.state.coinsCount} Coins
                </Text>
              </View>
              <View
                style={{
                  width: responsiveWidth(85),
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  disabled={this.state.readTimer != "15"}
                  onPress={() => this.claimCoins(15)}
                >
                  <View
                    style={{
                      padding: 10,
                      width: responsiveWidth(22),
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      backgroundColor:
                        this.state.readTimer == "15" ? "#e91e63" : "gray",
                      margin: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      15{"\n"}Coins
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={this.state.readTimer != "30"}
                  onPress={() => this.claimCoins(30)}
                >
                  <View
                    style={{
                      padding: 10,
                      width: responsiveWidth(22),
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      backgroundColor:
                        this.state.readTimer == "30" ? "#e91e63" : "gray",
                      margin: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      30{"\n"}Coins
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={this.state.readTimer != "60"}
                  onPress={() => this.claimCoins(60)}
                >
                  <View
                    style={{
                      padding: 10,
                      width: responsiveWidth(22),
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      backgroundColor:
                        this.state.readTimer == "60" ? "#e91e63" : "gray",
                      margin: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      60{"\n"}Coins
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                width: responsiveWidth(90),
                padding: 10,
                borderRadius: 10,
                elevation: 3,
                marginTop: 20,
                backgroundColor: "#fff",
              }}
            >
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
                        fontSize: 14,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Write your feedback
                    </Text>
                  </View>
                  <Ionicons name="ios-arrow-forward" size={18} color="gray" />
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: responsiveWidth(90),
                padding: 10,
                borderRadius: 10,
                elevation: 3,
                marginTop: 20,
                backgroundColor: "#fff",
              }}
            >
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
                        fontSize: 14,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      About App
                    </Text>
                  </View>

                  <Ionicons name="ios-arrow-forward" size={18} color="gray" />
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
                        fontSize: 14,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </View>
                  <Ionicons name="ios-arrow-forward" size={18} color="gray" />
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
                        fontSize: 14,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Terms & Conditions
                    </Text>
                  </View>
                  <Ionicons name="ios-arrow-forward" size={18} color="gray" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: responsiveHeight(50),
              width: responsiveWidth(90),
              borderRadius: 10,
              elevation: 3,
              backgroundColor: "#fff"
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

        {/* <View
          style={{
            width: responsiveWidth(100),
            height: responsiveHeight(20),
            position: "absolute",
            bottom: 0,
            elevation: 3,
            backgroundColor: "#fff",
            borderTopStartRadius: 60,
            borderTopEndRadius: 60,
            padding: 20,
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
       */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    alignItems: "center",
  },
});

export default Setting;

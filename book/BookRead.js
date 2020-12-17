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
  Image,
  TouchableWithoutFeedback,
  ToastAndroid,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Like from "../assets/like.svg";
import LikeFilled from "../assets/like_filled.svg";
import Error from "../assets/error.svg";
import DislikeFilled from "../assets/dislike_filled.svg";
import { Header } from "../book/common/header";
import { Rating } from "react-native-ratings";
import axios from "axios";
import * as Constant from "./common/constants";
import Constants from "expo-constants";
import AnimatedLoader from "react-native-animated-loader";
import AsyncStorage from "@react-native-community/async-storage";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import PDFReader from "rn-pdf-reader-js";
import CountDown from "react-native-countdown-component";

export default class BookInfo extends React.Component {
  state = {
    unlock: false,
    message: "",
    chapter: 1,
    chapter_url: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
    state: "",
    chapter_name: "",
    timer: 60 * 60,
    visible: false,
  };

  componentDidMount() {
    this.bookRead(1);
  }

  async bookRead(chapter) {
    this.setState({
      visible: true,
      chapter: chapter,
    });
    const data = {
      bookid: this.props.route.params.bookid,
      bookname: this.props.route.params.bookname,
      chapter: chapter,
    };

    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };

    console.log(data);
    console.log(headers);

    axios
      .post(Constant.bookReadApi, data, { headers: headers })
      .then((response) => {
        if (response.data.login == false) {
          this.props.navigation.navigate("Login");
          ToastAndroid.show("Please Login First!", ToastAndroid.SHORT);
          this.setState({
            visible: false,
          });
        } else if (
          response.data.login == true &&
          response.data.unlock == false
        ) {
          console.log(response.data);
          this.setState({
            unlock: response.data.unlock,
            message: response.data.message,
            visible: false,
          });
        } else {
          console.log("third", response.data);
          this.setState({
            unlock: response.data.unlock,
            message:
              response.data.chapter.chapter_url.slice(0, 4) != "http"
                ? "Book Not Available Currently!"
                : response.data.message,
            chapter_url:
              response.data.chapter.chapter_url.slice(0, 4) != "http"
                ? ""
                : response.data.chapter.chapter_url,
            state: response.data.chapter.state,
            chapter_name: response.data.chapter.chapter_name,
            visible: false,
          });
        }
      })
      .catch((e) => {
        console.log("err", e);
        this.setState({
          visible: false,
        });
      });
  }

  async unlockChapter() {
    const data = {
      bookid: this.props.route.params.bookid,
      bookname: this.props.route.params.bookname,
      chapter: this.state.chapter,
      coins: 30,
    };

    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };

    console.log(data);
    console.log(headers);

    axios
      .post(Constant.unlockChapterApi, data, { headers: headers })
      .then((response) => {
        console.log(response.data);
        if (response.data.login == false) {
          this.props.navigation.navigate("Login");
          ToastAndroid.show("Please Login First!", ToastAndroid.SHORT);
        } else {
          if (response.data.message == "Successfully unlock the chapter") {
            this.bookRead(this.state.chapter);
          }
          {
            ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          }
        }
      })
      .catch((e) => {
        console.log("unlock err", e);
        this.setState({
          visible: false,
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerTitle={
            this.state.chapter_name != ""
              ? this.state.chapter_name
              : this.props.route.params.title
          }
          backBtnVisible={true}
          onBackBtnPress={() => this.props.navigation.goBack()}
        />
        <AnimatedLoader
          visible={this.state.visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("../assets/loader.json")}
          animationStyle={{ width: 300, height: 300 }}
          speed={1}
        />
        {this.state.unlock == false ||
        this.state.message === "Book Not Available Currently!" ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: responsiveHeight(70),
              width: responsiveWidth(100),
            }}
          >
            <Error height={50} width={50} />
            <Text style={{ fontSize: 16, marginTop: 10 }}>
              {this.state.message}
            </Text>
            {this.state.message != "Book Not Available Currently!" ? (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={() => this.unlockChapter()}>
                  <View
                    style={{
                      backgroundColor: "#e91e63",
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      margin: 10,
                      alignSelf: "center",
                      flexDirection: "row",
                      width: responsiveWidth(50),
                    }}
                  >
                    <Entypo name="lock-open" size={16} color="white" />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Unlock Chapter
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.replace("MyStack", {
                      screen: "Setting",
                    })
                  }
                >
                  <View
                    style={{
                      backgroundColor: "#e91e63",
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      margin: 10,
                      alignSelf: "center",
                      flexDirection: "row",
                      width: responsiveWidth(50),
                    }}
                  >
                    <FontAwesome name="rupee" size={16} color="white" />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Buy Coins
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <View
                  style={{
                    backgroundColor: "#e91e63",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    margin: 10,
                    alignSelf: "center",
                    flexDirection: "row",
                    width: responsiveWidth(50),
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Go Back
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View
            style={{
              width: responsiveWidth(100),
              height: responsiveHeight(95),
            }}
          >
            {this.state.chapter_url != "" ? (
              <PDFReader
                source={{
                  uri: this.state.chapter_url,
                }}
                withScroll={true}
                withPinchZoom={true}
              />
            ) : null}
            {this.state.chapter_url != "" ? (
              <View
                style={{
                  position: "absolute",
                  top: -5,
                  zIndex: 1,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  width: responsiveWidth(100),
                  justifyContent: "space-between",
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  disabled={this.state.chapter == 1}
                  onPress={() => this.bookRead(this.state.chapter - 1)}
                  style={{}}
                >
                  <View
                    style={{
                      backgroundColor: "#e91e63",
                      padding: 10,
                      marginRight: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      alignSelf: "center",
                      flexDirection: "row",
                    }}
                  >
                    <FontAwesome
                      name="angle-double-left"
                      size={16}
                      color="white"
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Previous Chapter
                    </Text>
                  </View>
                </TouchableOpacity>
                {this.state.timer != 0 ?
                <CountDown
                  style={{ marginTop: 10 }}
                  until={this.state.timer}
                  size={2}
                  digitStyle={{ backgroundColor: "#e91e63" }}
                  digitTxtStyle={{ color: "#fff" }}
                  timeToShow={["M", "S"]}
                  timeLabels={{ m: "", s: "" }}
                  onChange={(text) => {
                    if (text == 2700) {
                      AsyncStorage.setItem('readTimer', "15")
                    }
                    if (text == 1800) {
                      AsyncStorage.setItem('readTimer', "30")
                    }
                    if (text == 1) {
                      AsyncStorage.setItem('readTimer', "60")
                      this.setState({
                        timer: 0
                      })
                    }
                  }}
                  onFinish={() => this.setState({ timer: 0 })}
                  running={this.state.unlock == false ? false : true}
                  size={20}
                /> : null }
                <TouchableOpacity
                  onPress={() => this.bookRead(this.state.chapter + 1)}
                  style={{}}
                >
                  <View
                    style={{
                      backgroundColor: "#e91e63",
                      padding: 10,
                      marginLeft: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      alignSelf: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Next Chapter
                    </Text>
                    <FontAwesome
                      name="angle-double-right"
                      size={16}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
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
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

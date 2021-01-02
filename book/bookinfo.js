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
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Like from "../assets/like.svg";
import LikeFilled from "../assets/like_filled.svg";
import Dislike from "../assets/dislike.svg";
import DislikeFilled from "../assets/dislike_filled.svg";
import { Header } from "../book/common/header";
import { Rating } from "react-native-ratings";
import axios from "axios";
import * as Constant from "./common/constants";
import Constants from "expo-constants";
import AnimatedLoader from "react-native-animated-loader";
import AsyncStorage from "@react-native-community/async-storage";

class BookInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      disliked: false,
      ranking: 0,
      visible: false,
      comments: [],
      myComment: "",
      token: "",
      id: "",
      book_name: "",
      views: "",
    };
  }

  // componentWillUnmount() {
  //   this._unsubscribe;
  // }

  async componentDidMount() {
    // this._unsubscribe = navigation.addListener('focus', async () => {
    //   this.setState({
    //     token: await AsyncStorage.getItem("token"),
    //     id: this.props.route.params.item.id,
    //     book_name: this.props.route.params.item.book_name,
    //   });
    // });
    this.setState({
      token: await AsyncStorage.getItem("token"),
      id: this.props.route.params.item.id,
      book_name: this.props.route.params.item.book_name,
    });
    console.log("token:", await AsyncStorage.getItem("token"));
    console.log("[id]", this.props);
    this.getBookInfo();
  }
  getBookInfo() {
    this.setState({
      visible: true,
    });
    const data = {
      bookid: this.state.id,
      bookname: this.state.book_name,
    };
    console.log("data", data);
    axios
      .post(Constant.getBookInfoApi, data)
      .then((response) => {
        console.log(response.data);
        this.setState({
          visible: false,
          bookName: response.data[0].book_name,
          ranking: response.data[0].ranking,
          author: response.data[0].author,
          briefInfo: response.data[0].book_brief_info,
          views: response.data[0].view,
          comments: response.data[0].comments,
          bookCover: response.data[0].book_cover_url,
        });
        console.log(response.data[0].comments.length);
      })
      .catch((e) => {
        console.log("getbookinfo error", JSON.stringify(e));
        this.setState({
          visible: false,
        });
      });
  }

  async upVote() {
    this.setState({
      visible: true,
    });

    const data = {
      bookid: this.state.id,
      bookname: this.state.book_name,
    };
    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };
    if ((await AsyncStorage.getItem("token")) != null) {
      axios
        .post(Constant.bookUpvoteApi, data, { headers: headers })
        .then((response) => {
          console.log("Response", response.data);
          // ToastAndroid.show(response.data, ToastAndroid.SHORT);
          this.setState({
            liked: true,
            disliked: false,
            ranking: response.data.ranking,
            views: response.data.view,
            comments: response.data.comments,
          });
          this.setState({
            visible: false,
          });
        })
        .catch((err) => {
          console.log("book up vote err", e);
          this.setState({
            visible: false,
          });
        });
    } else {
      this.setState({
        visible: false,
      });

      ToastAndroid.show("Please login first!", ToastAndroid.SHORT);
    }
  }

  async comment() {
    const data = {
      bookid: this.state.id,
      bookname: this.state.book_name,
      comment: this.state.myComment,
    };

    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };

    if (this.state.myComment != "") {
      this.setState({
        visible: true,
      });
      axios
        .post(Constant.bookCommentApi, data, { headers: headers })
        .then((response) => {
          this.setState({
            visible: false,
            bookName: response.data.book_name,
            ranking: response.data.ranking,
            author: response.data.author,
            briefInfo: response.data.book_brief_info,
            views: response.data.view,
            comments: response.data.comments,
            bookCover: response.data.book_cover_url,
            myComment: "",
          });
          console.log("comment response", response.data);
        })
        .catch((err) => {
          console.log("comment err", e);
          this.setState({
            visible: false,
          });
        });
    } else {
      ToastAndroid.show("Please add a comment!", ToastAndroid.SHORT);
    }
  }

  async downVote() {
    this.setState({
      visible: true,
    });
    const data = {
      bookid: this.state.id,
      bookname: this.state.book_name,
    };

    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };

    console.log("data", data);

    if ((await AsyncStorage.getItem("token")) != null) {
      axios
        .post(Constant.bookDownVoteApi, data, { headers: headers })
        .then((response) => {
          console.log("Response", response.data);
          // ToastAndroid.show(response.data, ToastAndroid.SHORT);
          this.setState({
            disliked: true,
            liked: false,
            ranking: response.data.ranking,
            views: response.data.view,
            comments: response.data.comments,
          });
          this.setState({
            visible: false,
          });
        })
        .catch((err) => {
          console.log("book down vote err", err);
          this.setState({
            visible: false,
          });
        });
    } else {
      this.setState({
        visible: false,
      });

      ToastAndroid.show("Please login first!", ToastAndroid.SHORT);
    }
  }

  showMessage() {
    ToastAndroid.show("Please login first!", ToastAndroid.SHORT);
  }

  async readBook() {
    console.log(this.state.token);
    if (
      (await AsyncStorage.getItem("token")) != null &&
      (await AsyncStorage.getItem("token")) != undefined
    ) {
      this.props.navigation.navigate("BookRead", {
        title: this.state.bookName,
        bookid: this.state.id,
        bookname: this.state.book_name,
      });
    } else {
      this.props.navigation.navigate("Login");
      ToastAndroid.show("Please Login First!", ToastAndroid.SHORT);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerTitle="Book Info"
          backBtnVisible={true}
          onBackBtnPress={() => this.props.navigation.goBack()}
        />
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View>
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
                justifyContent: "space-between",
                width: responsiveWidth(100),
                paddingVertical: 10,
              }}
            >
              <Image
                style={{
                  width: responsiveWidth(50),
                  height: responsiveHeight(30),
                  resizeMode: "contain",
                }}
                source={{ uri: this.state.bookCover }}
              />
              <View
                style={{ width: responsiveWidth(50), alignItems: "flex-start" }}
              >
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {this.state.bookName}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "gray",
                    alignSelf: "flex-start",
                    margin: 5,
                  }}
                >
                  {this.state.views + " Views"}
                </Text>
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      margin: 20,
                      marginTop: 0,
                      marginLeft: 0,
                      width: responsiveWidth(25),
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {this.state.liked ? (
                      <LikeFilled height={30} width={30} />
                    ) : (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.upVote();
                        }}
                      >
                        <Like height={30} width={30} />
                      </TouchableWithoutFeedback>
                    )}
                    <View style={{ marginTop: 25 }}>
                      {this.state.disliked ? (
                        <DislikeFilled height={30} width={30} />
                      ) : (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.downVote();
                          }}
                        >
                          <Dislike height={30} width={30} />
                        </TouchableWithoutFeedback>
                      )}
                    </View>
                  </View>
                  {/* <Rating
                type="heart"
                ratingCount={5}
                imageSize={24}
                readonly={true}
                showRating={false}
                ratingColor="#e91e63"
                ratingBackgroundColor="#e91e63"
                style={{ marginBottom: 10 }}
                startingValue={this.state.ranking}
              /> */}
                </View>
                <TouchableOpacity
                onPress={() => this.readBook()}
              >
                <View
                  style={{
                    backgroundColor: "#e91e63",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    margin: 10,
                    width: responsiveWidth(40),
                    alignSelf: "flex-start",
                    bottom: -10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Read Book
                  </Text>
                </View>
              </TouchableOpacity>
              </View>
              
            </View>
            <View style={{ padding: 20, paddingVertical: 0 }}>
              <Text style={{ fontWeight: "bold", fontSize: 13 }}>Author</Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 16, color: "#e91e63" }}
              >
                {this.state.author}
              </Text>
            </View>

            <View style={{ padding: 20, paddingVertical: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                Brief Info
              </Text>
              <Text style={{ fontSize: 15, color: "gray" }}>
                {this.state.briefInfo}
              </Text>
            </View>
            <View style={{ padding: 20, paddingVertical: 0 }}>
              <Text style={{ fontWeight: "bold", fontSize: 13 }}>Comments</Text>
            </View>
            {this.state.comments.length < 1 ? (
              <Text
                style={{
                  padding: 10,
                  fontSize: 16,
                  alignSelf: "center",
                  width: responsiveWidth(90),
                  textAlign: "center",
                }}
              >
                No Comments!
              </Text>
            ) : null}
            <FlatList
              data={this.state.comments}
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={(item, index) => index.toString()}
              style={{
                marginLeft: 20,
              }}
              renderItem={({ item, index }) => (
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      padding: 10,
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      width: responsiveWidth(90),
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 30,
                          aspectRatio: 1,
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: "#e91e63",
                          marginRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontWeight: "bold", color: "#e91e63" }}>
                          {item.username.slice(0, 1).toUpperCase()}
                        </Text>
                      </View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {item.comment}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignSelf: "flex-end",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        {item.username} |{" "}
                      </Text>
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        {item.email}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
            {this.state.token != null &&
            this.state.token != undefined &&
            this.state.token != "" ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: responsiveWidth(90),
                  alignSelf: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  placeholder="Enter Comment"
                  value={this.state.myComment}
                  onChangeText={(text) => this.setState({ myComment: text })}
                  style={{
                    width: responsiveWidth(70),
                    borderWidth: 1,
                    padding: 10,
                    paddingVertical: 5,
                    borderRadius: 20,
                    borderColor: "#c9a",
                  }}
                />
                <TouchableWithoutFeedback onPress={() => this.comment()}>
                  <View
                    style={{
                      width: responsiveWidth(18),
                      borderRadius: 10,
                      padding: 15,
                      paddingVertical: 10,
                      backgroundColor: "#e91e63",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                      Send
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : null}
          </View>
        </ScrollView>
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
});

export default BookInfo;

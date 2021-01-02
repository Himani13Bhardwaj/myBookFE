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
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Constants from "expo-constants";
import axios from "axios";
import Error from "../assets/error.svg";
import Reading from "../assets/reading-book.svg";
import Clock from "../assets/clock.svg";
import * as Constant from "../book/common/constants";
import AsyncStorage from "@react-native-community/async-storage";

class ReadingBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "readingBook",
      visible: false,
      latestBooks: [],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getLatestBooks();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getLatestBooks() {
    this.setState({
      visible: true,
    });
    const headers = {
      Authorization: "Token " + (await AsyncStorage.getItem("token")),
      "Content-Type": "application/json",
    };
    axios
      .post(Constant.userCollectionApi, "", { headers: headers })
      .then((response) => {
        this.setState({
          visible: false,
        });
        let BooksData = response.data;
        console.log("[latest books]", response.data);
        // if (callFrom == "search") {
        //   this.setState({
        //     authorsData: authorsData,
        //     authorPrevious: response.data.previous,
        //     authorNext: response.data.next,
        //   });
        // } else {
        // if (this.state.authorNext != "" && this.state.authorNext != null) {
        //   this.setState((prevState) => ({
        //     authorsData: [...prevState.authorsData, ...authorsData],
        //   }));
        // } else {
        this.setState({
          latestBooks: BooksData,
          lengthBook: BooksData.length,
        });
        //   }
        // }
      })
      .catch((e) => {
        console.log("err", e);
        this.setState({
          visible: false,
        });
      });
  }

  callActiveTab = (type) => {
    this.setState({ activeTab: type });
  };
  render() {
    return (
      <View style={styles.container}>
        {this.state.visible ? (
          <ActivityIndicator
            size="small"
            animating={this.state.visible}
            color="#e91e63"
          />
        ) : null}
        <View
          style={{
            flexDirection: "row",
            width: responsiveWidth(100),
            justifyContent: "space-between",
            paddingHorizontal: 20,
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text style={{fontSize: 18, fontWeight: "bold"}}>
            {this.state.activeTab == "readingBook"
              ? "Reading Books"
              : "Recent Books"}
          </Text>
          {this.state.activeTab == "readingBook" ? (
            <TouchableOpacity
              onPress={() => this.setState({ activeTab: "recentBook" })}
            >
              <View style={{ padding: 10, alignSelf: "flex-end" }}>
                <Reading width={40} height={40} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.setState({ activeTab: "readingBook" })}
            >
              <View style={{ padding: 10, alignSelf: "flex-end" }}>
                <Clock width={40} height={40} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {this.state.activeTab == "readingBook" ? (
          this.state.lengthBook > 0 ? (
            <FlatList
              data={this.state.latestBooks}
              contentContainerStyle={{
                paddingBottom: 30,
                alignItems: "flex-start",
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("BookInfo", {
                      item: item,
                      bookId: item.id,
                    })
                  }
                >
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: 20,
                      width: responsiveWidth(50),
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: responsiveWidth(35),
                        aspectRatio: 1,
                        margin: 10,
                        borderRadius: 200,
                        borderWidth: 4,
                        marginBottom: 10,
                        borderColor: "#c9ad",
                      }}
                    >
                      <View style={{ padding: 10 }}>
                        <Image
                          style={{
                            zIndex: -1,
                            width: responsiveWidth(30),
                            borderRadius: 200,
                            aspectRatio: 1,
                            resizeMode: "contain",
                          }}
                          source={{
                            uri:
                              item.book_cover_url != ""
                                ? item.book_cover_url
                                : "#https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=",
                          }}
                        />
                      </View>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{ color: "#000", fontWeight: "bold" }}
                    >
                      {item.book_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              numColumns={3}
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
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
                No Books Available Currently
              </Text>
            </View>
          )
        ) : this.state.lengthBook > 0 ? (
          <FlatList
            data={this.state.latestBooks}
            contentContainerStyle={{
              paddingBottom: 30,
              alignItems: "flex-start",
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("BookInfo", {
                    item: item,
                    bookId: item.id,
                  })
                }
              >
                <View
                  style={{
                    alignItems: "center",
                    marginBottom: 20,
                    width: responsiveWidth(50),
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: responsiveWidth(35),
                      aspectRatio: 1,
                      margin: 10,
                      borderRadius: 200,
                      borderWidth: 4,
                      marginBottom: 10,
                      borderColor: "#c9ad",
                    }}
                  >
                    <View style={{ padding: 10 }}>
                      <Image
                        style={{
                          zIndex: -1,
                          width: responsiveWidth(30),
                          borderRadius: 200,
                          aspectRatio: 1,
                          resizeMode: "contain",
                        }}
                        source={{
                          uri:
                            item.book_cover_url != ""
                              ? item.book_cover_url
                              : "#https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=",
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{ color: "#000", fontWeight: "bold" }}
                  >
                    {item.book_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            numColumns={3}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
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
              No Books Available Currently
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flexDirection: "row",
    padding: 0,
  },
  none: {
    display: "none",
  },
  block: {
    display: "flex",
  },

  tabContent: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    height: responsiveHeight(50),
    borderStyle: "solid",
  },
  activeTabPane: {
    padding: 10,
    marginTop: 10,
  },
  tabContentText: {},

  tinyLogo: {
    width: responsiveWidth(25),
    height: responsiveHeight(20),
    borderRadius: 5,
    marginTop: 10,
  },
});

export default ReadingBooks;

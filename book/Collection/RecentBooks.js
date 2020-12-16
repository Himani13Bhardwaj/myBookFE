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
} from "react-native";
import { Tab } from "../../book/tab";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Header } from "../../book/common/header";
import Constants from "expo-constants";
import axios from "axios";
import Error from "../../assets/error.svg";
import * as Constant from "../../book/common/constants";
import AsyncStorage from "@react-native-community/async-storage";

class RecentBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "readingBook",
      visible: false,
      latestBooks: [],
    };
  }

  componentDidMount() {
    this.getLatestBooks();
  }

  async getLatestBooks() {
    this.setState({
      visible: true,
    });
    const headers = {
      Authorization: await AsyncStorage.getItem("token"),
      "Content-Type": "application/json",
    };
    axios
      .get(Constant.userCollectionApi)
      .then((response) => {
        this.setState({
          visible: false,
        });
        let BooksData = response.data.latest;
        console.log("latest books", response.data);
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
        {this.state.latestBooks.length > 0 ? (
          <View style={styles.tabContent}>
            <View
              style={
                this.state["activeTab"] === "readingBook"
                  ? [styles.activeTabPane, styles.display]
                  : styles.none
              }
            >
              <FlatList
                data={this.state.latestBooks}
                contentContainerStyle={{
                  paddingBottom: 30,
                  alignItems: "flex-start",
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("BookInfo", { item: item })
                    }
                  >
                    <View
                      style={{
                        alignItems: "center",
                        marginBottom: 15,
                        alignSelf: "center",
                        width: responsiveWidth(32),
                        borderRadius: 10,
                      }}
                    >
                      <Image
                        style={[styles.tinyLogo, { resizeMode: "contain" }]}
                        source={{
                          uri: item.book_cover_url,
                        }}
                      />
                      <TouchableWithoutFeedback
                        onPress={() => this.getBookDetails(item)}
                      >
                        <View
                          style={{
                            width: responsiveWidth(30),
                            padding: 5,
                            backgroundColor: "#e91e63",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            borderRadius: 10,
                            margin: 10,
                            bottom: -15,
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#fff",
                              fontWeight: "bold",
                              fontSize: 12,
                            }}
                          >
                            {item.book_name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableOpacity>
                )}
                numColumns={3}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
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

export default RecentBooks;

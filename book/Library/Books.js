import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Header } from "../../book/common/header";
import { Tab } from "../../book/tab";
import axios from "axios";
import * as Constant from "../../book/common/constants";
import Constants from "expo-constants";
import Cover from "../../assets/book_placeholder.svg";
import AnimatedLoader from "react-native-animated-loader";
import Loupe from "../../assets/loupe.svg";
import Error from "../../assets/error.svg";

class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "books",
      booksData: [],
      searchBooksData: [],
      genresData: [],
      authorsData: [],
      authorPrevious: "",
      authorNext: "",
      pageNo: 0,
      pagenoAuth: 0,
      visible: false,
      searchLoader: false,
      modalVisible: false,
      searchedBook: "",
      filterBy: "book",
    };
  }

  callActiveTab = (type) => {
    this.setState({ activeTab: type });
  };

  getBookDetails = (data) => {
    this.props.navigation.navigate("BookInfo");
  };

  componentDidMount() {
    this.getBooksData(1, "");
  }

  getBooksData(pageNo, callFrom) {
    this.setState({
      pageNo: pageNo,
      visible: true,
    });
    console.log(Constant.getBooksApi + "?page=" + pageNo);
    axios.get(Constant.getBooksApi + "?page=" + pageNo).then((response) => {
      let bookData = response.data;
      console.log("BoosDta", response.data);
      this.setState({
        visible: false,
      });
      if (callFrom == "search") {
        this.setState({
          booksData: bookData,
        });
      } else {
        if (pageNo > 1) {
          console.log("hi");
          this.setState((prevState) => ({
            booksData: [...prevState.booksData, ...bookData],
          }));
        } else {
          this.setState({
            booksData: bookData,
          });
        }
      }

      // }
    });
  }

  getSearchedData(text) {
    this.setState({
      searchedBook: text,
      searchLoader: true,
    });
    var data = {};
    if (this.state.filterBy == "book") {
      data = {
        bookname: text,
        authorname: "",
      };
    } else {
      data = {
        bookname: "",
        authorname: text,
      };
    }

    console.log("request", data);

    axios
      .post(Constant.searchBookApi, data)
      .then((response) => {
        console.log("response", response.data);
        this.setState({
          searchBooksData: response.data,
          searchLoader: false,
        });
      
      })
      .catch((e) => {
        console.log("err", e);
        this.setState({
          searchLoader: false,
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <KeyboardAvoidingView>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ modalVisible: false })}
            >
              <View
                style={{
                  width: responsiveWidth(100),
                  height: responsiveHeight(100),
                  backgroundColor: "#000",
                  opacity: 0.5,
                }}
              />
            </TouchableWithoutFeedback>
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(80),
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
                backgroundColor: "#fff",
                zIndex: 1,
                position: "absolute",
                bottom: 0,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderRadius: 20,
                  height: 8,
                  width: 50,
                  alignSelf: "center",
                  backgroundColor: "#e91e63",
                  margin: 10,
                }}
              />

              {this.state.filterBy == "book" ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    marginRight: 20,
                    backgroundColor: "gray",
                    borderRadius: 50,
                    width: responsiveWidth(40),
                  }}
                >
                  <View
                    style={{
                      padding: 5,
                      borderRadius: 50,
                      backgroundColor: "#e91e63",
                      justifyContent: "center",
                      alignItems: "center",
                      width: responsiveWidth(20),
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                      By Book
                    </Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({ filterBy: "author" })}
                  >
                    <View
                      style={{
                        padding: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        width: responsiveWidth(20),
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        By Author
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    marginRight: 20,
                    backgroundColor: "gray",
                    borderRadius: 50,
                    width: responsiveWidth(40),
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({ filterBy: "book" })}
                  >
                    <View
                      style={{
                        padding: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        width: responsiveWidth(20),
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        By Book
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      padding: 5,
                      borderRadius: 50,
                      backgroundColor: "#e91e63",
                      justifyContent: "center",
                      alignItems: "center",
                      width: responsiveWidth(20),
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                      By Author
                    </Text>
                  </View>
                </View>
              )}
              <View
                style={{
                  width: responsiveWidth(90),
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 10,
                  marginTop: 10,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  placeholder="Search Book"
                  onChangeText={(text) => this.getSearchedData(text)}
                  style={{
                    width: responsiveWidth(75),
                  }}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Loupe height={20} width={20} />
                </View>
              </View>
              {this.state.searchLoader ? (
              <ActivityIndicator size="small" color="#e91e63" />
            ) : null}
              <FlatList
                data={
                  this.state.searchedBook == ""
                    ? this.state.booksData
                    : this.state.searchBooksData
                }
                nestedScrollEnabled={true}
                contentContainerStyle={{
                  paddingBottom: 30,
                  alignItems: "flex-start",
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("BookInfo", {
                        item: item,
                        bookId: item.id,
                      });
                      this.setState({ modalVisible: false });
                    }}
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
            </View>
          </KeyboardAvoidingView>
        </Modal>
        {this.state.booksData.length > 0 || this.state.searchedBook != "" ? (
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState({ modalVisible: !this.state.modalVisible })
            }
          >
            <View
              style={{
                width: responsiveWidth(90),
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 10,
                marginTop: 10,
                paddingHorizontal: 10,
                marginBottom: 10,
                justifyContent: "space-between",
              }}
            >
              <TextInput
                placeholder="Search Book"
                editable={false}
                style={{
                  width: responsiveWidth(75),
                }}
              />
              <View
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loupe height={20} width={20} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        <View style={styles.tabContent}>
          <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {this.state.booksData.length > 0 &&
            this.state.searchedBook == "" ? (
              <Image
                style={{
                  width: responsiveWidth(90),
                  height: 120,
                  resizeMode: "contain",
                }}
                source={require("../../assets/banner.jpg")}
              />
            ) : null}
            {this.state.visible ? (
              <ActivityIndicator size="small" color="#e91e63" />
            ) : null}
            {this.state.booksData.length > 0 ? (
              <FlatList
                data={this.state.booksData}
                nestedScrollEnabled={true}
                onMomentumScrollEnd={() => {
                  this.getBooksData(this.state.pageNo + 1, "");
                }}
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
          </ScrollView>

          {/* Book data ends */}
        </View>

        {/*  tab content ends */}
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
    marginTop: 0,
    height: responsiveHeight(50),
  },
  activeTabPane: {
    alignItems: "center",
    width: "100%",
  },
  tabContentText: {},
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  tinyLogo: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    borderRadius: 10,
  },
});

export default Books;

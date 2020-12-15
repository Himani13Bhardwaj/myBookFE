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
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Header } from "../book/common/header";
import { Tab } from "../book/tab";
import axios from "axios";
import * as Constant from "../book/common/constants";
import Constants from "expo-constants";
import Cover from "../assets/book_placeholder.svg";
import AnimatedLoader from "react-native-animated-loader";
import Loupe from "../assets/loupe.svg";
import Error from "../assets/error.svg";

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "books",
      booksData: [],
      genresData: [],
      authorsData: [],
      authorPrevious: "",
      authorNext: "",
      pageNo: 0,
      pagenoAuth: 0,
      visible: false,
      searchedBook: "",
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
    this.getGenresData(1);
    this.getAuthorsData(Constant.getAuthorsApi, "", 1);
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

  getGenresData(pageNo) {
    this.setState({
      pageNo: pageNo,
    });
    console.log(Constant.getGenresApi + "?pageno=" + pageNo);
    axios.get(Constant.getGenresApi + "?pageno=" + pageNo).then((response) => {
      let genresData = response.data;
      console.log("genres", response.data);
      // if (pageNo > 1) {
      //   this.setState(prevState => ({
      //     booksData: [...prevState.booksData, ...bookData],
      //   }))
      // } else {
      this.setState({
        genresData: genresData,
      });
      // }
    });
  }

  getSearchedData(bookname, authorname, type) {
    this.setState({
      searchedBook: bookname,
      visible: true,
    })
    if (type == 2 && authorname == "") {
      this.getAuthorsData(Constant.getAuthorsApi, "search", 1);
    } else if (type == 1 && bookname == "") {
      this.getBooksData(Constant.getBooksApi, "search");
    } else {
      const data = {
        bookname: bookname,
        authorname: authorname,
      };

      axios.post(Constant.searchBookApi, data).then((response) => {
        console.log("response", response.data)
        if (type == 1) {
          this.setState({
            booksData: response.data,
            visible: false
          });
        } else {
          this.setState({
            authorsData: response.data,
            visible: false
          });
        }
      })
      .catch(e => {
        console.log("err",e)
        this.setState({
          visible: false
        })
      });
    }
  }

  getAuthorsData(url, callFrom, pageno) {
    console.log(url);
    console.log("next", this.state.authorNext);
    if (url != null && url != this.state.authorNext) {
      this.setState({
        visible: true,
        pagenoAuth: pageno,
      });
      let callApi = "";
      if (this.state.authorNext != "" && this.state.authorNext != null) {
        callApi = url;
      } else {
        callApi = url + "?page=" + pageno;
      }
      axios.get(callApi).then((response) => {
        this.setState({
          visible: false,
        });
        let authorsData = response.data.results;
        console.log("authors", response.data);
        if (callFrom == "search") {
          this.setState({
            authorsData: authorsData,
            authorPrevious: response.data.previous,
            authorNext: response.data.next,
          });
        } else {
          if (this.state.authorNext != "" && this.state.authorNext != null) {
            this.setState((prevState) => ({
              authorsData: [...prevState.authorsData, ...authorsData],
            }));
          } else {
            this.setState({
              authorsData: authorsData,
              authorPrevious: response.data.previous,
              authorNext: response.data.next,
            });
          }
        }
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerTitle="Library" />
        <View style={styles.innerContainer}>
          <Tab
            mainTab="library"
            activeTab={this.state["activeTab"]}
            callActiveTab={() => this.callActiveTab("books")}
            type="books"
            label="Books"
            customWidth="34"
          />
          <Tab
            mainTab="library"
            activeTab={this.state["activeTab"]}
            callActiveTab={() => this.callActiveTab("genre")}
            type="genre"
            label="Genre"
            customWidth="34"
          />
          <Tab
            mainTab="library"
            activeTab={this.state["activeTab"]}
            callActiveTab={() => this.callActiveTab("author")}
            type="author"
            label="Authors"
            customWidth="34"
          />
          {/*  tab content starts */}
        </View>
        <View style={styles.tabContent}>
          <View
            style={
              this.state["activeTab"] === "books"
                ? [styles.activeTabPane, styles.display]
                : styles.none
            }
          >
            {/* Book data starts */}
            {/* onMomentumScrollBegin={() => this.getBooksData(this.state.pageNo+1)} */}
            {this.state.booksData.length > 0 || this.state.searchedBook != "" ? (
              <View
                style={{
                  width: responsiveWidth(90),
                  flexDirection: "row",
                  alignItems: "center",
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
                  onChangeText={(text) => this.getSearchedData(text, "", 1)}
                  style={{
                    width: responsiveWidth(70),
                  }}
                />
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Loupe height={24} width={24} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : null}
            <ScrollView nestedScrollEnabled={true} contentContainerStyle={{alignItems: "center"}}>
            {this.state.booksData.length > 0 && this.state.searchedBook == "" ? (
            <Image style={{width: responsiveWidth(90), height: 120, resizeMode:"contain"}} source={require('../assets/banner.jpg')}/>) : null }
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
                        marginVertical: 15,
                        alignSelf: "center",
                        width: responsiveWidth(33),
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
                        onPress={() =>
                          this.props.navigation.navigate("BookInfo", {
                            item: item,
                            bookId: item.id,
                          })
                        }
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
          <View
            style={
              this.state["activeTab"] === "genre"
                ? [styles.activeTabPane, styles.display]
                : styles.none
            }
          >
            {this.state.visible ? (
              <ActivityIndicator size="small" color="#e91e63" />
            ) : null}
            {this.state.genresData.length > 0 ? (
              <FlatList
                data={this.state.genresData}
                contentContainerStyle={{ alignItems: "flex-start" }}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate("Genres", {
                        id: item.id,
                        genreName: item.genre_name,
                        genre_image: item.genre_img,
                      })
                    }
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: 5,
                        marginVertical: 10,
                        borderRadius: 5,
                        backgroundColor: "#e5e5e5",
                      }}
                    >
                      <View
                        style={{
                          padding: 10,
                          paddingVertical: 20,
                        }}
                      >
                        <Image
                          source={{ uri: item.genre_img }}
                          style={{
                            height: 70,
                            width: 70,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: responsiveWidth(30),
                          backgroundColor: "#e91e63",
                          justifyContent: "center",
                          alignItems: "center",
                          borderBottomStartRadius: 5,
                          borderBottomEndRadius: 5,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{ color: "#fff", fontWeight: "bold" }}
                        >
                          {item.genre_name}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
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
                  No Genres Available Currently
                </Text>
              </View>
            )}
          </View>
          <View
            style={
              this.state["activeTab"] === "author"
                ? [styles.activeTabPane, styles.display]
                : styles.none
            }
          >
            {/* <View
              style={{
                width: responsiveWidth(90),
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 10,
                marginTop: 10,
                paddingHorizontal: 10,
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholder="Search Author"
                onChangeText={(text) => this.getSearchedData('', text, 2)}
                style={{
                  width: responsiveWidth(70),
                }}
              />
              <TouchableWithoutFeedback>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Loupe height={24} width={24} />
                </View>
              </TouchableWithoutFeedback>
            </View> */}
            {this.state.visible ? (
              <ActivityIndicator size="small" color="#e91e63" />
            ) : null}
            {this.state.authorsData.length > 0 ? (
              <FlatList
                data={this.state.authorsData}
                ref={(ref) => (this.authorsList = ref)}
                onMomentumScrollEnd={() => {
                  {
                    this.state.authorsData.length > 6
                      ? this.getAuthorsData(
                          this.state.authorNext,
                          "",
                          this.state.pagenoAuth + 1
                        )
                      : null;
                  }
                }}
                style={{ alignSelf: "center" }}
                contentContainerStyle={{
                  alignItems: "center",
                  width: responsiveWidth(90),
                  justifyContent: "space-between",
                  paddingBottom: 60,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("AuthorInfo", {
                        item: item,
                      })
                    }
                  >
                    <View style={{ alignItems: "center",
                          marginBottom: 20, width: responsiveWidth(50) }}>
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
                                item.profilepicture != ""
                                  ? item.profilepicture
                                  : "#https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=",
                            }}
                          />
                        </View>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={{ color: "#000", fontWeight: "bold" }}
                      >
                        {item.author_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                numColumns={2}
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
                  No Authors Available Currently
                </Text>
              </View>
            )}
          </View>
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
    marginTop: Constants.statusBarHeight,
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

export default Library;

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
  Animated,
  RefreshControl,
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
import Filter from "../../assets/filter.svg";
import { FlatListSlider } from "react-native-flatlist-slider";

const images = [
  {
    image:
      "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/old-books-arranged-on-shelf-royalty-free-image-1572384534.jpg?crop=0.668xw:1.00xh;0,0&resize=980:*",
    desc: "Silent Waters in the mountains in midst of Himilayas",
  },
  {
    image:
      "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/17-index-teenbooks-1551458115.jpg",
    desc:
      "Red fort in India New Delhi is a magnificient masterpeiece of humans",
  },
];

class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedValue: new Animated.Value(0),
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
      filterOption: false,
      searchedAuthor: "",
      searchedGenre: "",
      searchedLanguage: "",
    };
  }
  showActions = (value) => {
    Animated.timing(this.state.animatedValue, {
      toValue: value,
      duration: 1000,
    }).start();
  };

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
      modalVisible: false
    });
    var calledApi = Constant.getBooksApi + "?page=" + pageNo;

    if (this.state.searchedAuthor != "") {
      calledApi = calledApi + "&author=" + this.state.searchedAuthor;
    }
    if (this.state.searchedGenre != "") {
      calledApi = calledApi + "&genre=" + this.state.searchedGenre;
    }
    if (this.state.searchedLanguage != "") {
      calledApi = calledApi + "&language=" + this.state.searchedLanguage;
    }
    if (callFrom == "refresh") {
      calledApi = Constant.getBooksApi + "?page=" + pageNo;
    }

    console.log("called api", calledApi);
    axios.get(calledApi).then((response) => {
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
    })
    .catch(e => {
      console.log("err", e)
      this.setState({
        visible: false,
      });
    });
  }

  getSearchedData(text) {
    this.setState({
      searchedBook: text,
      visible: true,
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
          visible: false,
        });
      })
      .catch((e) => {
        console.log("err", e);
        this.setState({
          visible: false,
        });
      });
  }

  render() {
    let { animatedValue } = this.state;
    return (
      <View style={styles.container}>
        {/* <Animated.View
          style={{
            padding: 30,
            paddingVertical: 20,
            backgroundColor: "#fff",
            width: responsiveWidth(100),
            position: "absolute", top: 40, zIndex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-600, 0]
                })
              }
            ]
          }} >
          </Animated.View> */}

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
                height: responsiveHeight(100),
                backgroundColor: "#fff",
                zIndex: 1,
                position: "absolute",
                bottom: 0,
                alignItems: "center",
              }}
            >
              <Header
                headerTitle="Search Book"
                backBtnVisible={true}
                clearBtn= {true}
                onClearBtn = {() => {
                this.setState({
                  searchedAuthor: "",
                  searchedGenre: "",
                  searchedLanguage: "",
                })
                }}
                onBackBtnPress={() => this.setState({ modalVisible: false })}
              />

              <View
                style={{
                  height: 2,
                  width: responsiveWidth(100),
                  backgroundColor: "#fff",
                }}
              />
              <View
                style={{
                  width: responsiveWidth(100),
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity>
                  <View
                    style={{
                      width: responsiveWidth(30),
                      height: responsiveHeight(100),
                      borderRightWidth: 1,
                      borderColor: "#e5e5e5",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#e91e63",
                        width: responsiveWidth(30),
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Filter By
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    padding: 10,
                    height: responsiveHeight(90),
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <TextInput
                      placeholder="Search Author"
                      style={{
                        width: responsiveWidth(65),
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 5,
                        borderColor: "gray",
                      }}
                      value={this.state.searchedAuthor}
                      onChangeText={(text) =>
                        this.setState({ searchedAuthor: text })
                      }
                    />
                    <TextInput
                      placeholder="Search Genre"
                      style={{
                        width: responsiveWidth(65),
                        borderWidth: 1,
                        borderRadius: 10,
                        marginTop: 20,
                        padding: 5,
                        borderColor: "gray",
                      }}
                      value={this.state.searchedGenre}
                      onChangeText={(text) =>
                        this.setState({ searchedGenre: text })
                      }
                    />
                    <TextInput
                      placeholder="Search Language"
                      style={{
                        width: responsiveWidth(65),
                        borderWidth: 1,
                        borderRadius: 10,
                        marginTop: 20,
                        padding: 5,
                        borderColor: "gray",
                      }}
                      value={this.state.searchedLanguage}
                      onChangeText={(text) =>
                        this.setState({ searchedLanguage: text })
                      }
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      this.getBooksData(this.state.pageNo, "")
                    }
                  >
                    <View
                      style={{
                        width: responsiveWidth(30),
                        backgroundColor: "#e91e63",
                        borderRadius: 10,
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "flex-end",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Apply Filter
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        
        {this.state.booksData.length > 0 || this.state.searchedBook != "" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              alignSelf: "center",
              width: responsiveWidth(90),
            }}
          >
            <View
              style={{
                width: responsiveWidth(80),
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
                  width: responsiveWidth(65),
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
            <TouchableOpacity
              onPress={() =>
                this.setState({ modalVisible: !this.state.modalVisible })
              }
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Filter height={24} width={24} />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        <ScrollView
          nestedScrollEnabled={true}
              refreshControl={<RefreshControl colors={["#e91e63", "#74f7", "green"]} refreshing={this.state.visible} onRefresh={() => this.getBooksData(1, "refresh")}/>}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {this.state.booksData.length > 0 && this.state.searchedBook == "" ? (
            <View style={{ height: responsiveHeight(20) }}>
              <FlatListSlider
                data={images}
                height={240}
                timer={2000}
                onPress={(item) => console.log(item)}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                indicatorContainerStyle={{ position: "absolute", bottom: 20 }}
                indicatorActiveColor={"#e91e63"}
                indicatorInActiveColor={"#ffffff"}
                indicatorActiveWidth={30}
                animation
              />
            </View>
          ) : null}
          {this.state.booksData.length > 0 ? (
            <FlatList
              data={
                this.state.searchedBook == ""
                  ? this.state.booksData
                  : this.state.searchBooksData
              }
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

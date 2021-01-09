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
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Header } from "../book/common/header";
import Constants from "expo-constants";
import * as Constant from "./common/constants";
import axios from "axios";
import Error from "../assets/error.svg";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import AnimatedLoader from "react-native-animated-loader";

class Genres extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestBooks: [],
      visible: false,
    };
  }

  componentDidMount() {
    this.getGenreBooks(1);
  }

  getGenreBooks(page) {
    this.setState({
      pageNo: page,
      visible: true,
    });
    console.log(
      Constant.getBooksApi +
        "?page=" +
        page +
        "&genre=" +
        this.props.route.params.id
    );
    axios
      .get(
        Constant.getBooksApi +
          "?page=" +
          page +
          "&genre=" +
          this.props.route.params.id
      )
      .then((response) => {
        this.setState({
          visible: false,
        });
        let BooksData = response.data;
        console.log("latest books", response.data);
        if (page == 1) {
          this.setState({
            latestBooks: BooksData,
          });
        } else {
          this.setState((prevState) => ({
            latestBooks: [...prevState.latestBooks, ...BooksData],
          }));
        }
        // }
      })
      .catch((e) => {
        console.log("err", e);
        this.setState({
          visible: false,
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerTitle={this.props.route.params.genreName}
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
        {this.state.latestBooks.length > 0 ? (
          <FlatList
            data={this.state.latestBooks}
            contentContainerStyle={{ paddingBottom: 30, alignItems: "flex-start" }}
            onMomentumScrollEnd={() =>
              this.getGenreBooks(this.state.pageNo + 1)
            }
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
              No Books in this Genre
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
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  tinyLogo: {
    width: responsiveWidth(35),
    height: responsiveHeight(20),
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Genres;

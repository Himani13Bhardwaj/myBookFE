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
import { Header } from "../../book/common/header";
import { Tab } from "../../book/tab";
import axios from "axios";
import * as Constant from "../../book/common/constants";
import Constants from "expo-constants";
import Cover from "../../assets/book_placeholder.svg";
import AnimatedLoader from "react-native-animated-loader";
import Loupe from "../../assets/loupe.svg";
import Error from "../../assets/error.svg";

class GenresTab extends Component {
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
    this.getGenresData(1);
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



  render() {
    return (
      <View style={styles.container}>
           <View style={styles.tabContent}>
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

export default GenresTab;

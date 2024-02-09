import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import background from "./assets/jojowallpaper.png";
import searchButtonPng from "./assets/searchbutton.png";
import * as Font from "expo-font";
import standData from "./stands.json";
import AutoComplete from "react-native-autocomplete-input"; // Import AutoComplete from react-native-autocomplete-input

const customFonts = {
  "my-custom-font": require("./assets/fonts/font.ttf"),
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [secretStand, setSecretStand] = useState(null);
  const [data, setData] = useState([
    {
      id: "1",
      col1: "Name",
      col2: "Part",
      col3: "Type",
      col4: "Color",
      col5: "Design",
      col6: "Defeated by",
    },
  ]);

  const [selectedStand, setSelectedStand] = useState(null); // Define setSelectedStand

  // Function to set the secret stand
  const setSecretStandForUser = () => {
    const randomIndex = Math.floor(Math.random() * standData.stands.length);
    const stand = standData.stands[randomIndex];
    setSecretStand(stand);
  };

  // Load custom fonts
  async function loadFonts() {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadFonts();
      setSecretStandForUser();
    };

    fetchData();
  }, []);

  const addRow = () => {
    const newRow = {
      id: Math.random().toString(),
      col1: selectedStand.name,
      col2: selectedStand.part,
      col3: selectedStand.stand_type,
      col4: selectedStand.color,
      col5: selectedStand.design,
      col6: selectedStand.defeated_by,
      match:
        selectedStand && secretStand && selectedStand.name === secretStand.name,
      partMatch: selectedStand.part === secretStand.part,
      typeMatch: selectedStand.stand_type === secretStand.stand_type,
      colorMatch: selectedStand.color === secretStand.color,
      designMatch: selectedStand.design === secretStand.design,
      defeatedByMatch: selectedStand.defeated_by === secretStand.defeated_by,
    };

    setData([data[0], newRow, ...data.slice(1)]); // Insert new row after the first row
  };

  if (!fontsLoaded || secretStand === null) {
    // Fonts not loaded yet or secret stand not fetched, render loading indicator or null
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={background}
        resizeMode="cover"
      >
        <Text style={styles.header}>Standle</Text>
        <Hints secretStand={secretStand} />
        <StatusBar style="auto" />
        <StandSearch
          addRow={addRow}
          selectedStand={selectedStand}
          setSelectedStand={setSelectedStand} // Make sure setSelectedStand is passed down
        />
        <Table data={data} />
      </ImageBackground>
    </View>
  );
}
const StandSearch = ({ addRow, selectedStand, setSelectedStand }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { stands } = standData;
  const [filteredStands, setFilteredStands] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // Track input focus state

  const handleSearch = () => {
    addRow(selectedStand);
  };

  const handleItemPress = (item) => {
    setSearchQuery(item.name); // Set selected item's name to searchQuery
    setSelectedStand(item);
    setIsFocused(false); // Reset focus state
    setFilteredStands([]); // Clear filtered stands
  };

  const handleInputChange = (text) => {
    setSearchQuery(text);

    // Filter stands based on input text
    const filtered = stands.filter(
      (stand) => stand.name.toLowerCase().indexOf(text.toLowerCase()) > -1
    );
    setFilteredStands(filtered);
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.dropdownContainer}>
        <AutoComplete
          placeholder="Type any stand to begin"
          placeholderTextColor="gray"
          data={filteredStands}
          value={searchQuery}
          onChangeText={handleInputChange}
          flatListProps={{
            keyExtractor: (_, index) => index.toString(),
            renderItem: ({ item }) => (
              <TouchableOpacity
                onPress={() => handleItemPress(item)}
                style={styles.itemContainer}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            ),
          }}
          style={styles.autoComplete}
        />
        {isFocused &&
          searchQuery !== "" && ( // Render dropdown only when input is focused and not empty
            <ScrollView
              style={styles.dropdown}
              contentContainerStyle={{ maxHeight: 200 }}
            >
              <FlatList
                data={filteredStands}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleItemPress(item)}
                    style={styles.itemContainer}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
              />
            </ScrollView>
          )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSearch}>
          <Image source={searchButtonPng} style={styles.searchButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Table = ({ data }) => {
  // Custom component to render each row of the table
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <View
        style={[
          styles.cell,
          styles.col1,
          item.match ? styles.matchCell : styles.wrongCell,
          index === 0 && styles.firstCell,
        ]}
      >
        <Text style={[styles.cellText]}>{item.col1}</Text>
      </View>
      <View
        style={[
          styles.cell,
          styles.col2,
          item.partMatch ? styles.matchCell : styles.wrongCell,
          index === 0 && styles.firstCell,
        ]}
      >
        <Text style={[styles.cellText]}>{item.col2}</Text>
      </View>
      <View
        style={[
          styles.cell,
          styles.col3,
          item.typeMatch ? styles.matchCell : styles.wrongCell,
          index === 0 && styles.firstCell,
        ]}
      >
        <Text style={[styles.cellText]}>{item.col3}</Text>
      </View>
      <View
        style={[
          styles.cell,
          styles.col4,
          item.colorMatch ? styles.matchCell : styles.wrongCell,
          index === 0 && styles.firstCell,
        ]}
      >
        <Text style={[styles.cellText, ,]}>{item.col4}</Text>
      </View>
      <View
        style={[
          styles.cell,
          styles.col5,
          item.designMatch ? styles.matchCell : styles.wrongCell,
          index === 0 && styles.firstCell,
        ]}
      >
        <Text style={[styles.cellText]}>{item.col5}</Text>
      </View>
      <View
        style={[
          styles.cell,
          styles.col6,
          item.defeatedByMatch ? styles.matchCell : styles.wrongCell,
          index === 0 && styles.firstCell,
        ]}
      >
        <Text style={[styles.cellText]}>{item.col6}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.tableContainer}>
      {Platform.OS === "web" ? (
        <ScrollView horizontal={true} style={styles.scrollView}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
          />
        </ScrollView>
      ) : (
        <ScrollView horizontal={true} style={styles.scrollView}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
          />
        </ScrollView>
      )}
    </View>
  );
};

const Hints = ({ secretStand }) => {
  const [showSecretStand, setShowSecretStand] = useState(false);

  const handleInfoBoxClick = () => {
    setShowSecretStand(!showSecretStand);
  };

  return (
    <View style={styles.hintsContainer}>
      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <Text>coming soon!</Text>
        </View>
        <View style={styles.box}></View>
        <View style={styles.box}></View>
      </View>
      <TouchableOpacity style={styles.infoBox} onPress={handleInfoBoxClick}>
        <Text>{showSecretStand ? secretStand.name : ""}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 50,
    color: "white", // Change text color to white
    fontWeight: "bold",
    fontFamily: "my-custom-font",
    textShadowColor: "black", // Add text shadow color
    textShadowOffset: { width: -1, height: -1 }, // Negative offsets for border
    textShadowRadius: 5, // Add text shadow radius
    textAlign: "center", // Optional: Adjust text alignment if needed
    marginTop: 50,
    margin: 5,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    maxHeight: 200,
  },
  dropdownContainer: {
    width: 200,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    alignItems: "flex-start",
    overflow: "visible",
  },
  dropdownInput: {
    width: 206,
    height: 40,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: "my-custom-font",
    paddingLeft: 10,
  },
  searchContainer: {
    height: 70,
    width: 300,
    flexDirection: "row", // Arrange children horizontally
    alignItems: "center", // Center horizontally
    justifyContent: "center",
    zIndex: 999,
  },
  buttonContainer: {
    marginLeft: 10, // Add spacing between the search bar and the button
    alignItems: "center", // Center horizontally
    marginTop: 10,
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    paddingTop: 0, // Remove top padding
    alignItems: "flex-start", // Align content to the top
  },
  tableContainer: {
    flex: 1,
    alignItems: "center", // Align children horizontally
    zIndex: 0,
    flexGrow: 1, // Allow the table container to grow
    justifyContent: "flex-start", // Align children at the top of the container
    marginTop: 10, // Adjust the marginTop to reduce the gap
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    minWidth: 120,
    maxWidth: 120,
    height: 60,
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // Set the background color to transparent
  },
  cellText: {
    fontFamily: "my-custom-font",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    textAlign: "center",
    fontSize: 16,
  },
  matchCell: {
    backgroundColor: "rgba(0, 255, 0, 0.5)",
  },
  wrongCell: {
    backgroundColor: "rgba(255, 0, 0, 0.5)",
  },
  firstCell: {
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  col1: { flexBasis: 100 },
  col2: { flexBasis: 100 },
  col3: { flexBasis: 100 },
  col4: { flexBasis: 100 },
  col5: { flexBasis: 100 },
  col6: { flexBasis: 100 },
  list: {
    flex: 1,
  },
  hintsContainer: {
    margin: 15,
    height: 150,
    width: 330,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(169, 169, 169, 0.5)",
    borderRadius: 10,
  },
  boxContainer: {
    flexDirection: "row",
  },
  box: {
    flex: 1,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 10,
    width: 80,
    height: 80,
  },
  infoBox: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 10,
    width: 250,
    height: 50,
  },
  scrollView: {
    maxHeight: "90%",
    flexGrow: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  autoComplete: {
    width: 200, // Set a fixed width according to your preference
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 2, // Add a thicker vertical bar
    borderColor: "gray", // Customize the border color if needed
    paddingVertical: 10, // Adjust padding as needed
  },
  itemText: {
    fontSize: 16, // Customize the font size if needed
    fontFamily: "my-custom-font",
  },
  searchButton: {
    height: 45, // Adjust height as needed
    width: 75,
    resizeMode: "contain", // Adjust resizeMode as needed
  },
});

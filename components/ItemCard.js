import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../components/Colors';
import {heightToDp, widthToDp} from '../utils/Responsive';

let selectedLoadArray = {};
let selectedLoadArrayWithoutloadname = {};

const DashboardCard = ({
  backgroundColor,
  cardName,
  imageUrl,
  onPress,
  styleData,
  qty,
  cardId,
  loadName,
  selectedData,
  salePrice,
  refresh,
}) => {
  const [UpdateQtyofItem, setUpdateQtyofItem] = useState({});
  const [updateQty, setupdatedQty] = useState({
    0: {VATstatus: false, buyerId: '0', cardId: 0, value: 0},
  });
  const [UpdateQtyofItems, setUpdateQtyofItems] = useState(0);
  const [cartData, setCartData] = useState();
  const [myLatestData, setMyLatestData] = useState(0);
  const [selectedBuyerId, setselectedBuyerId] = useState(0);
  const [ganeratingLoadLoader, setGenerateLoader] = useState(false);

  const win = Dimensions.get('window');

  useEffect(() => {
    AsyncStorage.getItem('selectedBuyerRouteId').then(buyerId => {
      setselectedBuyerId(buyerId);
    });

    if (selectedLoadArray.length != 0) {
      selectedLoadArray = {};
      selectedLoadArrayWithoutloadname = {};
    }
    getPendingOrderResponce();
    return () => {
      selectedLoadArray = {};
      selectedLoadArrayWithoutloadname = {};
      AsyncStorage.removeItem('itemsAddedInCart')
        .then(x => console.log(x))
        .catch(error => console.error(error));
      AsyncStorage.removeItem('cartItems')
        .then(x => console.log(x))
        .catch(error => console.error(error));
      AsyncStorage.setItem('selectedLoadedItemsByQty', JSON.stringify({}))
        .then(x => console.log(x))
        .catch(error => console.error(error));
    };
  }, []);

  function getPendingOrderResponce() {
    AsyncStorage.getItem('selectedBuyer').then(buyerId => {
      AsyncStorage.getItem('cartItems').then(data => {
        if (data != null) {
          let myRecords = {};
          let myRecordsFinal = {};
          let myRecordsFinalWithoutLoadnumber = {};
          let relData = JSON.parse(data);

          if (data != undefined) {
            for (let i = 0; i < relData.length; i++) {
              let dnum = relData[i].dnum;
              let sitem = relData[i].sitem;
              let qty = relData[i].qty;

              myRecords[relData[i].dnum + '_' + relData[i].sitem] = qty;
              myRecordsFinal[relData[i].dnum + '__' + relData[i].sitem] = {
                buyerId: buyerId,
                value: JSON.parse(qty),
                cardId: relData[i].sitem,
                VATstatus: false,
              };

              myRecordsFinalWithoutLoadnumber[relData[i].sitem] = {
                buyerId: buyerId,
                value: JSON.parse(qty),
                cardId: relData[i].sitem,
                VATstatus: false,
              };
              AsyncStorage.setItem(
                'selectedLoadedItemsByQty',
                JSON.stringify(myRecordsFinal),
              );

              AsyncStorage.setItem(
                'itemsAddedInCart',
                JSON.stringify(myRecords),
              );
            }
            setCartData(myRecords);
            selectedLoadArray = myRecordsFinal;
            selectedLoadArrayWithoutloadname = myRecordsFinalWithoutLoadnumber;
          }
        }
      });
    });
  }

  function DirectUpdateQTY(loadName, cardId, qty) {
    if (qty.substring(0, 1) == '.') {
      qty = '0' + qty;
    }

    if (cartData != undefined) {
      if (loadName + '_' + cardId in cartData) {
        cartData[loadName + '_' + cardId] = qty.toString();
        setCartData(cartData);
      }
    }
    qty = parseFloat(qty);

    AsyncStorage.getItem('selectedBuyerRouteId').then(buyerId => {
      selectedLoadArray[loadName + '__' + cardId] = {
        value: qty,
        cardId: cardId,
        VATstatus: false,
        buyerId: buyerId,
      };
      selectedLoadArrayWithoutloadname[cardId] = {
        value: qty,
        cardId: cardId,
        VATstatus: false,
        buyerId: buyerId,
      };
      setUpdateQtyofItem(selectedLoadArray);
      selectedData(selectedLoadArray);

      setUpdateQtyofItems(qty);
      // AsyncStorage.setItem('selectedLoadedItemsByQty' , JSON.stringify(selectedLoadArray));
    });
  }

  function addQtyItem(loadName, cardId) {
    setGenerateLoader(true);
    let loadedName = loadName + '__' + cardId;
    if (cartData != undefined) {
      if (loadName + '_' + cardId in cartData) {
        cartData[loadName + '_' + cardId] = (
          parseInt(cartData[loadName + '_' + cardId]) + 1
        ).toString();
        setCartData(cartData);
      }
    }

    setMyLatestData(myLatestData + 1);
    if (selectedLoadArray[loadedName] != undefined) {
      selectedLoadArray[loadedName].value =
        parseFloat(selectedLoadArray[loadedName].value) + 1;
      selectedLoadArrayWithoutloadname[cardId].value =
        parseFloat(selectedLoadArrayWithoutloadname[cardId].value) + 1;
      setUpdateQtyofItem(selectedLoadArray);
      selectedData(selectedLoadArray);

      setTimeout(() => {
        setGenerateLoader(false);
      }, 2000);
    } else {
      selectedLoadArray[loadName + '__' + cardId] = {
        value: 1,
        cardId: cardId,
        VATstatus: false,
        buyerId: selectedBuyerId,
      };
      selectedLoadArrayWithoutloadname[cardId] = {
        value: 1,
        cardId: cardId,
        VATstatus: false,
        buyerId: selectedBuyerId,
      };
      setUpdateQtyofItem(selectedLoadArray);
      selectedData(selectedLoadArray);

      setTimeout(() => {
        setGenerateLoader(false);
      }, 2000);
    }
  }

  function minusQtyItem(loadName, cardId) {
    let buyerIds = '';
    AsyncStorage.getItem('selectedBuyerRouteId').then(buyerId => {
      buyerIds = buyerId;
    });

    let loadedName = loadName + '__' + cardId;

    if (cartData != undefined) {
      if (loadName + '_' + cardId in cartData) {
        cartData[loadName + '_' + cardId] = (
          parseInt(cartData[loadName + '_' + cardId]) - 1
        ).toString();

        setCartData(cartData);
      }
    }

    setMyLatestData(myLatestData - 1);

    if (selectedLoadArray[loadedName] != undefined) {
      selectedLoadArray[loadedName].value =
        selectedLoadArray[loadedName].value - 1;
      selectedLoadArrayWithoutloadname[cardId].value =
        selectedLoadArrayWithoutloadname[cardId].value - 1;
      setUpdateQtyofItem(selectedLoadArray);
      selectedData(selectedLoadArray);
    } else {
      selectedLoadArray[loadName + '__' + cardId] = {
        value: -1,
        cardId: cardId,
        VATstatus: false,
        buyerId: buyerIds,
      };
      selectedLoadArrayWithoutloadname[cardId] = {
        value: -1,
        cardId: cardId,
        VATstatus: false,
        buyerId: buyerIds,
      };

      setUpdateQtyofItem(selectedLoadArray);
      selectedData(selectedLoadArray);
    }
  }

  return (
    <View>
      <View style={{height: 30, width: 100, justifyContent: 'center'}}>
        {ganeratingLoadLoader ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 9999999,
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            }}>
            <ActivityIndicator color={Colors.primary} size={32} />
          </View>
        ) : null}
      </View>
      {qty == 'true' ? (
        <View>
          <View
            style={[
              win.width > 550
                ? styles.cardBackgroundtab
                : styles.cardBackground,
              {backgroundColor: backgroundColor},
              styleData,
            ]}>
            <View style={styles.itemImageContainer}>
              <Image
                source={{uri: imageUrl}}
                style={win.width > 550 ? styles.itemImageTab : styles.itemImage}
              />
              <Text
                style={
                  (styles.cardName,
                  {height: 'auto', fontSize: 12, marginTop: 6, marginBottom: 6})
                }
                allowFontScaling={false}>
                {cardName.length > 15
                  ? cardName.substring(0, 15 - 3) + '...'
                  : cardName}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: '#ebedf087',
                width: '100%',
              }}>
              <View style={win.width > 550 ? {width: '20%'} : {width: '20%'}}>
                <Pressable
                  onPress={() => {
                    minusQtyItem(loadName, cardId);
                  }}
                  style={{backgroundColor: 'red', padding: 8, height: 50}}>
                  <Icon
                    name="minus"
                    type="font-awesome"
                    style={
                      win.width > 500
                        ? {fontSize: 20, color: 'white', textAlign: 'center'}
                        : {fontSize: 12, color: 'white', textAlign: 'center'}
                    }
                  />
                </Pressable>
                {/* <Button title="clickme" onPress={() => {clickme()}}></Button> */}
              </View>
              <View style={win.width > 550 ? {width: '60%'} : {width: '60%'}}>
                <TextInput
                  keyboardType="numeric"
                  defaultValue={
                    selectedLoadArrayWithoutloadname != undefined &&
                    selectedLoadArrayWithoutloadname[cardId] != undefined
                      ? selectedLoadArrayWithoutloadname[
                          cardId
                        ].value.toString()
                      : '0'
                  }
                  key={cardId}
                  placeholder="Qty"
                  style={{textAlign: 'center', color: '#000'}}
                  onChange={value => {
                    value.nativeEvent.text != ''
                      ? DirectUpdateQTY(
                          loadName,
                          cardId,
                          value.nativeEvent.text,
                        )
                      : '';
                  }}
                />
              </View>
              <View style={win.width > 550 ? {width: '20%'} : {width: '20%'}}>
                <Pressable
                  onPress={() => {
                    addQtyItem(loadName, cardId);
                  }}
                  style={{
                    backgroundColor: 'green',
                    padding: 7,
                    height: 50,
                  }}>
                  <Icon
                    name="plus"
                    type="font-awesome"
                    style={
                      win.width > 500
                        ? {fontSize: 20, color: 'white', textAlign: 'center'}
                        : {fontSize: 12, color: 'white', textAlign: 'center'}
                    }
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={onPress}
          style={[
            win.width > 550 ? styles.cardBackgroundtab : styles.cardBackground,
            {backgroundColor: backgroundColor},
            styleData,
          ]}>
          <View style={styles.itemImageContainer}>
            <Image
              source={{uri: imageUrl}}
              style={win.width > 550 ? styles.itemImageTab : styles.itemImage}
            />
          </View>

          <View style={styles.cardFooterBackground}>
            <Text style={styles.cardName} allowFontScaling={false}>
              {cardName.length > 15
                ? cardName.substring(0, 15 - 3) + '...'
                : cardName}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardName: {
    color: Colors.dark,
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardFooterBackground: {
    backgroundColor: '#ebedf087',
    height: 40,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  iconBackground: {
    alignItems: 'center',
    backgroundColor: Colors.secondry,
    height: 60,
    width: 60,
    resizeMode: 'stretch',
    position: 'absolute',
    top: 15,
    justifyContent: 'center',
    borderRadius: 100,
  },
  cardBackgroundtab: {
    width: widthToDp('23.5%'),
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    overflow: 'hidden',
    height: 190,
  },
  cardBackground: {
    width: widthToDp('30%'),
    borderRadius: 4,
    marginTop: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 15,
    overflow: 'hidden',
    height: 150,
  },
  itemImage: {
    // flex: 1,
    height: heightToDp('10.7%'),
    width: widthToDp('20%'),
    // resizeMode: 'contain',
    marginTop: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemImageTab: {
    // flex: 1,
    height: heightToDp('9%'),
    width: widthToDp('14%'),
    // resizeMode: 'contain',
  },
  itemImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardCard;

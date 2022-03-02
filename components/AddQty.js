/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Colors } from '../components/Colors';
const win = Dimensions.get('window');

let totalAmountVatWithout = 0;
let totalAmountVat = 0;
let setUpdatedDataArray = [];
let salePrices = 0;
let mynewdata = {};
let updatedMynewdata = {};
let updateRecord = {};

function AddQty({
  val,
  data,
  selectedItemFromItemsScreen,
  updatedPrice,
  updatedDataRes,
  updateMyObjectData,
  keyboard,
  savedSalePrice,
}) {
  const [newData, setNewData] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [changestate, setChangeState] = useState(false);
  const [myUpdatePrice, setMyUpdatePrice] = useState(0);
  const [beforeUpdPrice, setbeforeUpdatePrice] = useState({});

  useEffect(() => {
    setNewData(data);
    setSelectedItem(selectedItemFromItemsScreen);
    setbeforeUpdatePrice(savedSalePrice);
  }, []);

  function generateRandString() {
    return (Math.random() * (999999999 - 1) + 1).toFixed(0);
  }

  function updateVATStatusOfProduct(dnum, itemId) {
    totalAmountVatWithout = 0;
    totalAmountVat = 0;
    let price = 0;
    let myData = newData;

    let objectData = selectedItem;
    if (dnum in objectData) {
      if (objectData[dnum].VATstatus == false) {
        objectData[dnum].VATstatus = true;
      } else {
        objectData[dnum].VATstatus = false;
      }
      setSelectedItem(objectData);
      updateMyObjectData(objectData);
      // setSelectedItemFromItemsScreen(objectData)
    }

    if (myData != undefined) {
      for (let i = 0; i < myData.length; i++) {
        if (myData[i][dnum] != undefined) {
          if (myData[i][dnum].VATstatus == false) {
            myData[i][dnum].VATstatus = true;
            setNewData(myData);
            updatedDataRes(myData);
            // AsyncStorage.setItem('beforeUpdatePrice' , JSON.stringify(myData)).then(()=> {

            // })
          } else {
            myData[i][dnum].VATstatus = false;
            setNewData(myData);
            updatedDataRes(myData);
            // AsyncStorage.setItem('beforeUpdatePrice' , JSON.stringify(myData))
          }
          // selectedLoadedItemsByQty();
        }
      }
    }
    if (changestate == false) {
      setChangeState(true);
    } else {
      setChangeState(false);
    }
  }

  function updateQty(dnum, itemId, qty) {
    let myData = newData;
    let newQty = 0;
    let objectData = selectedItem;

    if (qty != '') {
      newQty = qty;
    }

    if (dnum in objectData) {
      objectData[dnum].value = qty;
      setSelectedItem(objectData);
      updateMyObjectData(objectData);
    }
    if (myData != undefined) {
      for (let i = 0; i < myData.length; i++) {
        if (myData[i][dnum] != undefined) {
          if (myData[i][dnum].id == itemId) {
            myData[i][dnum].order_qty = qty;
            updatedDataRes(myData);
            setNewData(myData);
          }
        }
      }
    }
  }

  function updatePrice(dnum, itemId, qty) {
    let myData = newData;
    let newQty = 0;
    let objectData = selectedItem;

    if (dnum in objectData) {
      objectData[dnum].sale_price = qty;
      setSelectedItem(objectData);
      updateMyObjectData(objectData);
    }

    if (qty != '') {
      newQty = qty;
    }

    if (myData != undefined) {
      let parseMyres = {};
      for (let i = 0; i < myData.length; i++) {
        if (myData[i][dnum] != undefined) {
          if (myData[i][dnum].id == itemId) {
            myData[i][dnum].sale_price = newQty;

            setNewData(myData);
            updatedDataRes(myData);
            AsyncStorage.getItem('beforeUpdatePrice').then(myres => {
              if (myres != null) {
                if (JSON.parse(myres).length != 0) {
                  let parseMyres = [];
                  parseMyres = JSON.parse(myres);
                  parseMyres[dnum] = newQty;
                  AsyncStorage.setItem(
                    'beforeUpdatePrice',
                    JSON.stringify(parseMyres),
                  );
                } else {
                  parseMyres[dnum] = newQty;

                  AsyncStorage.setItem(
                    'beforeUpdatePrice',
                    JSON.stringify(parseMyres),
                  );
                }
              } else {
                let parseMyres = [];
                parseMyres[dnum] = newQty;
                AsyncStorage.setItem(
                  'beforeUpdatePrice',
                  JSON.stringify(parseMyres),
                );
              }

              return false;
            });
          }
        }
      }
    }
  }

  return (
    <View
      style={win.width > 500 ? styles.mainBoxTab : styles.mainBox}
      key={generateRandString()}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginTop: 20,
        }}>
        <View style={styles.itemBox} key={generateRandString()}>
          {val?.itemcategory != 'EGGS' ? (
            <CheckBox
              size={40}
              key={val?.id}
              checked={val?.VATstatus}
              center={true}
              onPress={() => {
                updateVATStatusOfProduct(val?.loadId, val?.id);
              }}
            />
          ) : (
            <View style={{width: 60}} />
          )}
        </View>
        <View key={generateRandString()} style={{marginTop: 20}}>
          <Text
            key={generateRandString()}
            style={{fontSize: 15, fontWeight: 'bold'}}
            allowFontScaling={false}>
            {val?.name.length > 20
              ? (val?.name).substring(0, 20) + '..'
              : val?.name}
          </Text>
          <Text style={{fontSize: 10}} allowFontScaling={false}>
            {' '}
            Available Stock {val?.loadId}{' '}
          </Text>
        </View>
      </View>

      <View key={generateRandString()} style={styles.inputBox}>
        <TextInput
          keyboardType="numeric"
          placeholder="Qty"
          value={(val?.order_qty).toString()}
          ref={value => {}}
          style={styles.textInput}
          onChange={value => {
            updateQty(val?.loadId, val?.id, value.nativeEvent.text);
          }}
        />
        {/* val?.sale_price */}
        <TextInput
          keyboardType="numeric"
          placeholder="Price"
          value={(Object.keys(beforeUpdPrice).length > 0 &&
          val?.loadId in beforeUpdPrice
            ? beforeUpdPrice[val?.loadId]
            : val?.sale_price
          ).toString()}
          ref={value => {}}
          style={styles.textInput}
          onChange={value => {
            updatePrice(val?.loadId, val?.id, value.nativeEvent.text);
          }}
        />
        <Text
          style={{
            minWidth: 70,
            paddingHorizontal: 10,
            paddingVertical: 15,
            backgroundColor: '#ededed',
            borderWidth: 1,
            borderColor: Colors.primary,
          }}>
          {(
            (val?.order_qty).toString() *
            (Object.keys(beforeUpdPrice).length > 0 &&
            val?.loadId in beforeUpdPrice
              ? beforeUpdPrice[val?.loadId]
              : val?.sale_price)
          ).toFixed(2)}
        </Text>
        <View
          style={{
            minWidth: 40,
            paddingHorizontal: 10,
            paddingVertical: 15,
            backgroundColor: '#ededed',
            borderWidth: 1,
            borderColor: Colors.primary,
          }}>
          {val?.VATstatus == true ? (
            <View>
              <Text>
                {(
                  (val?.order_qty).toString() *
                    (Object.keys(beforeUpdPrice).length > 0 &&
                    val?.loadId in beforeUpdPrice
                      ? beforeUpdPrice[val?.loadId]
                      : val?.sale_price) *
                    1.2 -
                  (val?.order_qty).toString() *
                    (Object.keys(beforeUpdPrice).length > 0 &&
                    val?.loadId in beforeUpdPrice
                      ? beforeUpdPrice[val?.loadId]
                      : val?.sale_price)
                ).toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text>0</Text>
          )}
        </View>
        <View
          style={{
            minWidth: 40,
            paddingHorizontal: 10,
            paddingVertical: 15,
            backgroundColor: '#ededed',
            borderWidth: 1,
            borderColor: Colors.primary,
          }}>
          {val?.VATstatus == true ? (
            <View>
              <Text>
                {(
                  (val?.order_qty).toString() *
                    (Object.keys(beforeUpdPrice).length > 0 &&
                    val?.loadId in beforeUpdPrice
                      ? beforeUpdPrice[val?.loadId]
                      : val?.sale_price) *
                    1.2 -
                  (val?.order_qty).toString() *
                    (Object.keys(beforeUpdPrice).length > 0 &&
                    val?.loadId in beforeUpdPrice
                      ? beforeUpdPrice[val?.loadId]
                      : val?.sale_price) +
                  (val?.order_qty).toString() *
                    (Object.keys(beforeUpdPrice).length > 0 &&
                    val?.loadId in beforeUpdPrice
                      ? beforeUpdPrice[val?.loadId]
                      : val?.sale_price)
                ).toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text>
              {(
                (val?.order_qty).toString() *
                (Object.keys(beforeUpdPrice).length > 0 &&
                val?.loadId in beforeUpdPrice
                  ? beforeUpdPrice[val?.loadId]
                  : val?.sale_price)
              ).toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vehicleImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  plusButton: {
    position: 'relative',
    backgroundColor: Colors.parrotGreen,
    alignSelf: 'center',
  },
  minisButton: {
    position: 'relative',
    backgroundColor: Colors.redMaroon,
    alignSelf: 'center',
  },
  mainBoxTab: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    borderColor: 'red',
    height: 90,
    paddingHorizontal: 5,
  },
  mainBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderColor: 'red',
    height: 130,
    paddingHorizontal: 5,
  },

  itemBox: {
    alignItems: 'center',
    textAlign: 'center',
    height: 80,
    width: 60,
    paddingRight: 20,
    // borderColor: 'blue',
    // borderWidth: 2
  },

  checkbox: {
    alignSelf: 'center',
  },
  buttonBox: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 0.8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'dodgerblue',
    height: 120,
    marginRight: 25,
  },
  textInput: {
    borderColor: Colors.purple,
    borderWidth: 1,
    width: 60,
    color: '#000',
    textAlign: 'center',
  },
  textInputTab: {
    borderColor: Colors.purple,
    borderWidth: 1,
    width: 60,
    color: '#000',
    textAlign: 'center',
  },
  activeStatus: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 10,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  deActiveStatus: {
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  activeStatusText: {
    color: 'white',
  },
  deActiveStatusText: {
    color: Colors.primary,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 130,
    width: '67%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
  },
});
export default AddQty;

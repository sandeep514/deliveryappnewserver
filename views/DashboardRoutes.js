import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Colors} from '../components/Colors';
import MainScreen from '../layout/MainScreen';
import {heightToDp} from '../utils/Responsive';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getPriorityDrivers,
  getSaleItemByInvoice,
  saveSortedPriority,
} from '../api/apiService';
import ItemComponent from './component/inputcomponent';
import uuid from 'react-native-uuid';

import cache from '../utils/cache';

function LoadingComponent() {
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

export default function DashboardRoutes({navigation, route}) {
  const [listRoute, setListRoute] = useState();
  const [hasRoutes, setHasRoutes] = useState(false);
  const [SaveLoader, setSaveLoader] = useState(false);
  const [reloader, setReloader] = useState(false);
  const [sortedLists, setSortedLists] = useState({});
  const [ActInd, setActInd] = useState(false);
  const [loading, setLoading] = useState(false);

  // let boardRepository = new BoardRepository(route.params.myRoutes);
  // useEffect(() => {
  //   getRoutes();
  // }, [reloader]);

  function renderItemComponent({item, index}) {
    return (
      <TouchableHighlight
        style={{padding: 0, margin: 0}}
        key={uuid.v4()}
        onPress={event => listClicked(item)}>
        <ListItem
          containerStyle={
            active == item?.id
              ? styles.active
              : item?.delivery_status == 0
              ? {backgroundColor: '#ff6363'}
              : item?.delivery_status == 1
              ? {backgroundColor: 'white'}
              : {backgroundColor: 'blue'}
          }
          key={uuid.v4()}
          bottomDivider>
          <Image
            source={require('../assets/images/map.png')}
            style={styles.Avatar}
          />
          <ListItem.Content>
            <ListItem.Title>{item?.name}</ListItem.Title>
            <ListItem.Title>{item?.address}</ListItem.Title>
          </ListItem.Content>
          <Pressable
            onPress={() => {
              navigation.push('listInvoices', {buyerId: item?.id});
            }}>
            <Icon
              name="cog"
              type="font-awesome"
              color={Colors.primary}
              style={{padding: 10}}
            />
          </Pressable>
        </ListItem>
      </TouchableHighlight>
    );
  }

  async function resetStorage() {
    let resonse = await cache.deleteItem('selectedLoadedItemsByQty');
    let resonse1 = await cache.deleteItem('cartItems');
    let resonse2 = await cache.deleteItem('itemsAddedInCart');
    let resonse3 = await cache.store('selectedLoadedItemsByQty', {});
    let resonse4 = await cache.store('beforeUpdatePrice', {});
    let resonse5 = await cache.deleteItem('beforeUpdatePrice');
    Promise.all([resonse, resonse1, resonse2, resonse3, resonse4, resonse5])
      .then(values => {
        console.log(values);
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    resetStorage();
    getRoutes();
  }, []);

  function gotoCart(invoiceNo, selectedBuyer) {
    setActInd(true);
    getSaleItemByInvoice(invoiceNo).then(async data => {
      setActInd(false);
      let cartItemsPromise = await cache.store('cartItems', data?.data?.data);
      let selectedInvoiceIdPromise = await cache.store(
        'selectedInvoiceId',
        invoiceNo,
      );
      let selectedBuyerPromise = await cache.store(
        'selectedBuyer',
        selectedBuyer,
      );

      Promise.all([
        cartItemsPromise,
        selectedInvoiceIdPromise,
        selectedBuyerPromise,
      ])
        .then(async values => {
          let myRecords = {};
          let myRecordsFinal = {};
          let relData = data.data.data;

          if (data != undefined) {
            for (let i = 0; i < relData.length; i++) {
              let dnum = relData[i]?.dnum;
              let sitem = relData[i]?.sitem;
              let qty = relData[i]?.qty;

              myRecords[relData[i]?.dnum + '_' + relData[i]?.sitem] = qty;
              myRecordsFinal[relData[i]?.dnum + '__' + relData[i]?.sitem] = {
                buyerId: selectedBuyer,
                value: JSON.parse(qty),
                cardId: relData[i]?.sitem,
                VATstatus: false,
              };

              let promise = await cache.store(
                'undeliveredItems',
                myRecordsFinal,
              );
              let promise1 = await cache.store(
                'selectedLoadedItemsByQty',
                myRecordsFinal,
              );
              let promise2 = await cache.store('itemsAddedInCart', myRecords);

              Promise.all([promise, promise1, promise2])
                .then(values => {
                  console.log('Cart');
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
          navigation.push('ItemsScreenWithQty', {
            mySelectedItems: myRecordsFinal,
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  const getRoutes = () => {
    AsyncStorage.getItem('selectedRoute').then(routeId => {
      AsyncStorage.getItem('user_id').then(async driverid => {
        let cancelToken = axios.CancelToken.source();
        try {
          setLoading(true);
          let response = await getPriorityDrivers(
            routeId,
            driverid,
            cancelToken,
          );
          setListRoute(response?.data?.data);
          setLoading(false);
          console.log('Api Calling', response?.status);
        } catch (e) {
          console.error(e);
          setLoading(false);
        }
      });
    });
  };

  const [active, setActive] = useState();

  const listClicked = async listData => {
    console.log(listData);
    if ('latest_invoice' in listData) {
      setActive(listData?.id);
      let promise1 = await cache.store(
        'selectedBuyerRouteName',
        listData?.name,
      );
      let promise2 = await cache.store('selectedBuyerRouteId', listData?.id);
      Promise.all([promise1, promise2])
        .then(values => {
          gotoCart(listData?.latest_invoice, listData?.id);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setActive(listData?.id);
      let newPromises = await cache.store('selectedBuyerRouteId', listData?.id);
      let newPromises2 = await cache.store(
        'selectedBuyerRouteName',
        listData?.name,
      );
      Promise.all([newPromises, newPromises2])
        .then(values => {
          console.log('local storage else:', values);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <MainScreen>
      <View style={styles.container}>
        <View style={styles.nextButton}>
          <Pressable
            onPress={() => {
              if (active != undefined) {
                let selectedLoadedItemsByQtyPromise = cache.store(
                  'selectedLoadedItemsByQty',
                  {},
                );
                selectedLoadedItemsByQtyPromise.then(value => {
                  navigation.push('ItemsScreenWithQty');
                });
              } else {
                alert('Please select any buyer');
              }
            }}>
            <Icon
              name="chevron-right"
              type="font-awesome"
              color="white"
              style={{padding: 10}}
            />
          </Pressable>
        </View>

        {loading == true ? (
          <LoadingComponent />
        ) : (
          <View style={{padding: 0, margin: 0}}>
            <FlatList
              data={listRoute}
              renderItem={renderItemComponent}
              refreshing={loading}
              onRefresh={getRoutes}
            />
          </View>
        )}
      </View>
    </MainScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityContainer: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#ededed',
    zIndex: 9999,
    opacity: 0.5,
  },
  listItemContainer: {
    padding: 0,
    margin: 0,
    width: 60,
    marginTop: 15,
    height: 60,
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '96%',
    height: 45,
    zIndex: 9999,
    top: 0,
    backgroundColor: Colors.primary,
    borderRadius: 100,
    margin: 10,
  },
  nextButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 70,
    height: 70,
    zIndex: 9999,
    bottom: 0,
    right: 3,
    backgroundColor: Colors.primary,
    borderRadius: 100,
    margin: 10,
  },
  refreshBottom: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 70,
    height: 70,
    zIndex: 9999,
    top: 1,
    padding: 18,
    backgroundColor: 'lightgrey',
    borderRadius: 100,
    margin: 10,
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Avatar: {width: 50, height: 50, resizeMode: 'contain'},

  listValues: {
    color: Colors.dark,
    fontSize: heightToDp('2.5%'),
    fontWeight: '800',
  },
  titleKey: {
    color: Colors.primary,
    fontSize: heightToDp('2.5%'),
    fontWeight: '900',
  },
  logoutButton: {
    position: 'relative',
    backgroundColor: Colors.redMaroon,
    paddingHorizontal: '10%',
    borderRadius: 10,
    alignSelf: 'center',
  },
  active: {
    backgroundColor: 'pink',
    color: 'white',
  },
  unactive: {
    backgroundColor: 'white',
    color: 'white',
  },
  maps: {
    width: '100%',
    height: 310,
  },
});

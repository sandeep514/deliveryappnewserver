/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getItemsByVehicleAndLoads, imagePrefix } from '../api/apiService';
import { Colors } from '../components/Colors';
import ItemCard from '../components/ItemCard';
import MainScreen from '../layout/MainScreen';
import uuid from 'react-native-uuid';

let itemList = [];
export default function ItemsScreen({navigation}) {
  const [activeIndicatorLoader, setActiveIndicatorLoader] = useState(true);
  const [ListItems, setListItems] = useState();
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    let unAmounted = false;

    if (!unAmounted) {
      getItems();
    }

    //Hook Clean Up
    return () => {
      unAmounted = true;
    };
  }, []);

  function getItems() {
    AsyncStorage.getItem('selectedVehicleNo').then(value => {
      let vehicheId = value;
      AsyncStorage.getItem('selectedLoadsNumbers').then(async value => {
        let load_numbers = value;
        try {
          let cancelToken;
          let response = await getItemsByVehicleAndLoads(
            vehicheId,
            load_numbers,
            cancelToken,
          );
          setListItems(response.data.data);
          setActiveIndicatorLoader(false);
        } catch (error) {
          setActiveIndicatorLoader(false);
          console.error(error);
        }
      });
    });
  }

  return (
    <MainScreen>
      <ScrollView>
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              marginTop: 40,
            }}>
            <Icon
              name="arrow-left"
              type="font-awesome"
              style={{
                fontSize: 25,
                color: 'red',
                textAlign: 'center',
                padding: 10,
              }}
              onPress={() => {
                navigation.navigate('Dashboard');
              }}
            />
            <View style={{justifyContent: 'center', width: '80%'}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.primary,
                  fontSize: 22,
                  fontWeight: '700',
                }}>
                Loaded Items
              </Text>
            </View>
          </View>
        </View>
        {activeIndicatorLoader == true ? (
          <ActivityIndicator size="large" color="#6c33a1" />
        ) : (
          <Text />
        )}

        {ListItems != undefined ? (
          Object.keys(ListItems).map((key, value) => {
            return (
              <View key={uuid.v4()} style={{marginBottom: 85}}>
                <Text
                  style={{
                    fontSize: 18,
                    paddingLeft: 30,
                    backgroundColor: Colors.primary,
                    color: 'white',
                    textAlign: 'center',
                    paddingVertical: 5,
                    marginLeft: 10,
                  }}>
                  {key}
                </Text>
                {Object.keys(ListItems[key]).map((k, v) => {
                  return (
                    <View key={uuid.v4()}>
                      <Text
                        key={uuid.v4()}
                        style={{
                          paddingHorizontal: 13,
                          paddingVertical: 10,
                          backgroundColor: '#ededed',
                          fontSize: 18,
                          marginTop: 15,
                        }}>
                        {k}
                      </Text>
                      <View
                        key={uuid.v4()}
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          justifyContent: 'space-evenly',
                        }}>
                        {Object.keys(ListItems[key][k]).map((ke, val) => {
                          return (
                            <ItemCard
                              key={uuid.v4()}
                              backgroundColor="#fff"
                              loadName={key}
                              cardId={ListItems[key][k][ke].id}
                              cardName={ListItems[key][k][ke].name}
                              imageUrl={
                                imagePrefix + '' + ListItems[key][k][ke].img
                              }
                            />
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })
        ) : (
          <Text />
        )}
      </ScrollView>
      <Pressable
        onPress={() => {
          AsyncStorage.setItem('refreshLoad', 'Items');
          navigation.navigate('loads');
        }}
        style={{
          bottom: 10,
          position: 'absolute',
          justifyContent: 'center',
          padding: 10,
          height: 70,
          width: 70,
          backgroundColor: Colors.primary,
          borderRadius: 100,
          right: 10,
        }}>
        <Icon
          name="refresh"
          type="font-awesome"
          style={{fontSize: 25, color: 'white', textAlign: 'center'}}
        />
      </Pressable>
    </MainScreen>
  );
}

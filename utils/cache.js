import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = 'cache_';

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

const get = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (err) {
    console.error(err);
  }
};

const deleteItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (exception) {
    console.error(exception);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error(error);
  }
};

const dumpRaw = () => {
  return AsyncStorage.getAllKeys().then(keys => {
    return Promise.reduce(
      keys,
      (result, key) => {
        return AsyncStorage.getItem(key).then(value => {
          result[key] = value;
          return result;
        });
      },
      {},
    );
  });
};

export default {
  clearAll,
  deleteItem,
  store,
  get,
  dumpRaw,
};

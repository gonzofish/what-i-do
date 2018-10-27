import localForage from 'localforage';

let cache;

export default () => {
  cache = localForage.createInstance({
    driver: localForage.INDEXEDDB,
    name: 'whatido',
    storeName: 'whatidoStore',
    version: 1.0,
  })
};

export const getItem = (key) => cache.getItem(key);
export const removeItem = (key) => cache.removeItem(key);
export const setItem = (key, value) => cache.setItem(key, value);

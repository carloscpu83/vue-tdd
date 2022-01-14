import SecureLS from "secure-ls";

const secure = new SecureLS({encodingType: 'aes', encryptionSecret: 'my-secret-key-2'});

const getItem = (item) => {
  //return JSON.parse(localStorage.getItem(item));
  return secure.get(item);
};

const setItem = (key, value) => {
  //localStorage.setItem(key, JSON.stringify(value));
  secure.set(key, value);
};

const clear = () => {
  localStorage.clear();
};

export default { getItem, setItem, clear };

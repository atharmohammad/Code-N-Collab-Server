let idx = -1;

const keys = [
  [process.env.COMPILE_CLIENT_ID1, process.env.COMPILE_CLIENT_SECRET1],
  [process.env.COMPILE_CLIENT_ID2, process.env.COMPILE_CLIENT_SECRET2],
  [process.env.COMPILE_CLIENT_ID3, process.env.COMPILE_CLIENT_SECRET3],
  [process.env.COMPILE_CLIENT_ID4, process.env.COMPILE_CLIENT_SECRET4],
];

const sz = keys.length;

const AwesomeKey = () => {
  idx++;
  if (idx == sz) idx = 0;
 
  return keys[idx];
};

module.exports = {
  AwesomeKey,
};

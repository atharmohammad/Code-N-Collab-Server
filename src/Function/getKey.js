let idx = -1;

const keys = [
  [
    "d4b7771b3992895017e5ac5f42ec46e6",
    "37f00b6e1c5f23675ff6bd195a0e6d6631b9f8384dd9c25d1a82a5d274256db3",
  ],
];

const sz = keys.length;

const AwesomeKey = () => {
  idx++;
  if (idx == sz) idx = 0;

  console.log(idx);
  return keys[idx];
};

module.exports = {
  AwesomeKey,
};

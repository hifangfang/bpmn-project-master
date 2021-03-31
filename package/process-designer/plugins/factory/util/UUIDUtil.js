//生成组件标识id
export function createrProvideId(prefix) {
  let res = [], hex = '0123456789ABCDEF';
  for (let i = 0; i < 36; i++) res[i] = Math.floor(Math.random() * 0x10);
  res[14] = 4;
  res[19] = (res[19] & 0x3) | 0x8;
  for (let i = 0; i < 36; i++) res[i] = hex[res[i]];
  res[8] = res[13] = res[18] = res[23] = '-';
  return prefix + res.join('');
}

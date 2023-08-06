const codeFormatter = (msg) => {
  let code = "";
  const reg = /\d{4,8}/;
  const match = msg.match(reg);
  if (match) {
    code = match[0];
  }
  return code;
};

module.exports = { codeFormatter };

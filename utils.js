exports.ID = (length = 3) => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  let id = "";

  for (let i = 0; i < length; i++) {
    id += S4();
  }

  return id;
};

exports.formatDate = (date) => {
  let year = date.getFullYear().toString();
  let month = date.getMonth() + 1;
  let day = date.getDate().toString();

  if (month < 10) {
    month = "0" + month;
  }
  let d = year + "/" + month.toString() + "/" + day;
  return d;
};

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const showDateString = dateObj => {
  dateObj = new Date(dateObj);
  let year = dateObj.getFullYear();
  let date = dateObj.getDate();
  let monthIndex = dateObj.getMonth();
  let month = months[monthIndex];
  return `${month} ${date}, ${year}`;
};

var _default = showDateString;
exports.default = _default;
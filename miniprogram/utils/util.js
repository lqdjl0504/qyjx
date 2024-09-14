function formatTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRandomColor() {
  // 生成随机的RGB颜色值
  const getRandomRgb = () => {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
  };

  // 生成三个随机颜色
  const color1 = getRandomRgb();
  const color2 = getRandomRgb();
  const color3 = getRandomRgb();

  // 生成三个随机百分比
  const percent1 = Math.floor(Math.random() * 100); // 0% - 100%
  const percent2 = Math.floor(Math.random() * 100) + percent1; // 保证在percent1之后
  const percent3 = 100; // 最后一个颜色总是100%

  // 返回渐变背景样式
  return `45deg, ${color1} ${percent1}%, ${color2} ${percent2}%, ${color3} ${percent3}%`;
}

function getRandomColor_v2() {
  // 生成随机的RGB颜色值
  const getRandomRgb = () => {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
  };

  // 生成三个随机颜色
  const color1 = getRandomRgb();
  const color2 = getRandomRgb();

  // 返回渐变背景样式
  return `to bottom right, ${color1}, ${color2}`;
}

function generateCardNumber() {
  let randomNum = Math.floor(Math.random() * (9007199254740993 - 1) + 1); // 生成范围为[1, 9007199254740993]之间的随机数
  let strRandomNum = randomNum.toString();
  while (strRandomNum.length < 16) {
    strRandomNum = '0' + strRandomNum;
  }
  let cardNumber = strRandomNum.replace(/(\d{4})(?=\d)/g, '$1 ');
  return cardNumber;
}


// 向外暴露
module.exports = {
  formatDate: formatDate,    //'对外方法名':'本地方法名'
  formatTime: formatTime,
  getRandomColor: getRandomColor,
  getRandomColor_v2: getRandomColor_v2,
  generateCardNumber: generateCardNumber
}

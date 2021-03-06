import moment from "moment";
import {notification} from "antd/lib/index";

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === "today") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === "week") {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === "month") {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, "months");
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      )
    ];
  }

  if (type === "year") {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = "") {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ""}`.replace(/\/+/g, "/");
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ["角", "分"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [["元", "万", "亿"], ["", "拾", "佰", "仟"]];
  let num = Math.abs(n);
  let s = "";
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
      /零./,
      ""
    );
  });
  s = s || "整";
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = "";
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, "元")
    .replace(/(零.)+/g, "零")
    .replace(/^整$/, "零元整");
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn("Two path are equal!"); // eslint-disable-line
  }
  const arr1 = str1.split("/");
  const arr2 = str2.split("/");
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ""));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(
      route => route !== item && getRelation(route, item) === 1
    );
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function parseError(errors) {
  console.log("parseError errors :",errors);
  let errorString = "";
  if (errors.split("|")[1]) {
    errorString = errors.split("|")[1];
  } else {
    errorString = errors;
  }
  return errorString;
}

export const successNotification = (msg = "操作成功!", callback) => {
  notification["success"]({
    message: msg,
    duration: 2,
    onClose: () => { callback() }
  });
};

// score
export const handleSore = (score) => {
  const scoreObj = {
    "public":"公开",
    "member":"仅会员",
    "non-member":"非会员",
    "welcome":"欢迎课"
  };
  return scoreObj[score];
};

// level
export const handleLevel = (level) => {
  let levelObj = {};
  if(isNaN(level) === true){
    levelObj = {
      "level1":"海狸",
      "level2":"小狼",
      "level3":"探索",
      "level4":"乐扶"
    };
  }else {
    levelObj = {
      1:"海狸",
      2:"小狼",
      3:"探索",
      4:"乐扶"
    };
  }

  return levelObj[level];
};

// stage
export const handleStage = (stage) => {
  let stageObj = {};
  if(isNaN(stage) === true) {
    stageObj = {
      "stage1": "一阶",
      "stage2": "二阶",
      "stage3": "三阶",
      "stage4": "四阶",
      "stage5": "五阶"
    };
  }else{
    stageObj = {
      1: "一阶",
      2: "二阶",
      3: "三阶",
      4: "四阶",
      5: "五阶"
    };
  }
  return stageObj[stage];
};

// 课程类型返回处理 type  课程类型 0:团集会 1:活动 2:兴趣课
export const handleType = (type) => {
  const typeObj = {
    0:"团集会",
    1:"活动",
    2:"兴趣课",
  };
  return typeObj[type];
};

/**
 * 商品规格的排列组合
 * */
export const doExchange = (arr) => {
  let len = arr.length;
  // 当数组大于等于2个的时候
  if(len >= 2){
    // 第一个数组的长度
    let len1 = arr[0].length;
    // 第二个数组的长度
    let len2 = arr[1].length;
    // 2个数组产生的组合数
    let lenBoth = len1 * len2;
    //  申明一个新数组,做数据暂存
    let items = new Array(lenBoth);
    // 申明新数组的索引
    let index = 0;
    // 2层嵌套循环,将组合放到新数组中
    for(let i=0; i<len1; i++){
      for(let j=0; j<len2; j++){
        items[index] = arr[1][j] +"-"+ arr[0][i];
        index++;
      }
    }
    // 将新组合的数组并到原数组中
    let newArr = new Array(len -1);
    for(let i=2;i<arr.length;i++){
      newArr[i-1] = arr[i];
    }
    newArr[0] = items;
    // 执行回调
    return doExchange(newArr);
  }else{
    return arr[0];
  }
};

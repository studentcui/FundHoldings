const fs = require("fs");
const path = require('path');
const os = require("os");

const dataDir = path.join(os.homedir(), '/AppData/Local/FundRecord');
//基金名称文件
const fundNames = path.join(os.homedir(), '/AppData/Local/FundRecord/names');
//基金购买记录文件
const records = path.join(os.homedir(), '/AppData/Local/FundRecord/records.json');

//添加基金名称
function addFundName() {
    debugger
    let name = document.getElementById("name");
    let inputName = name.value;
    fs.appendFileSync(fundNames, "," + name.value, 'utf8');
    name.value = "";
    loadSelect();
    let list = document.getElementById("list");
    for (i of list.options) {
        if (i.value == inputName) {
            i.selected = true;
        }
    }

}

//删除基金名称
function deleteFundName() {
    let name = document.getElementById("list");
    if (confirm("你确定删除" + name.value + "吗？")) {
        let result = fs.readFileSync(fundNames, 'utf8').replace("," + name.value, '');
        fs.writeFileSync(fundNames, result, 'utf8');
        loadSelect();
    }
}

//购买基金
function purchase() {
    let name = document.getElementById("list");
    let quantity = document.getElementById("quantity");
    let date = document.getElementById("date").value;
    let result;
    if (!fs.existsSync(records)) {
        result = JSON.parse("[]");
    } else {
        let recordsFileText = fs.readFileSync(records, 'utf8');
        if (recordsFileText) {
            result = JSON.parse(recordsFileText);
        } else {
            result = JSON.parse("[]");
        }
    }
    result.push({ "id": uuidv4(), "name": name.value, "quantity": quantity.value, "date": date });
    //按时间排序
    for (let i = 0; i < result.length - 1; ++i) {
        for (let j = 0; j < result.length - 1 - i; ++j) {
            if (result[j].date > result[j + 1].date) {
                let temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }
    fs.writeFileSync(records, JSON.stringify(result), 'utf8');
    quantity.value = "";
    loadRecords();
}

//卖基金
function sell(id) {
    if (confirm("你确定卖出吗？")) {
        let fileRecords = JSON.parse(fs.readFileSync(records, 'utf8'));
        for (let i = 0; i < fileRecords.length; ++i) {
            if (fileRecords[i].id == id) {
                fileRecords.splice(i, 1);
            }
        }
        fs.writeFileSync(records, JSON.stringify(fileRecords), 'utf8');
        loadRecords();
    }
}

//加载基金购买记录
function loadRecords() {
    debugger
    let recordsDiv = document.getElementById("records");
    let listFilter = document.getElementById("listFilter");
    let daysFilter = document.getElementById("daysFilter");
    let quantitySum = 0;
    let recordsList = "";

    if (fs.existsSync(records)) {
        let recordsFileText = fs.readFileSync(records, 'utf8');
        if (recordsFileText) {
            let result = JSON.parse(recordsFileText);
            let cnt = 1;
            for (i of result) {
                if ((listFilter.value == "" && daysFilter == "") || (listFilter.value == i.name && daysFilter.value == "") 
                    || (listFilter.value == "" && daysFilter.value <= purchaseDays(i.date)) 
                    || (listFilter.value == i.name && daysFilter.value <= purchaseDays(i.date))) {
                        quantitySum += parseFloat(i.quantity);
                        let clazz = cnt++ % 2 == 1 ? ' class="odd"' : '';
                        recordsList += '<ul' + clazz + '><li>' + i.name + '</li><li>' + i.quantity + '</li><li>' + i.date
                            + '</li><li>' + purchaseDays(i.date) + '</li><li><a href="javascript:void(0);" onclick="sell(\'' + i.id + '\');">卖了</a></li></ul>';
                }
            }
        }
    }
    let quantitySumSpan = document.getElementById("quantitySum");
    quantitySumSpan.innerText = quantitySum.toFixed(2);
    recordsDiv.innerHTML = recordsList;
}

//加载基金名称下拉框
function loadSelect() {
    let list = document.getElementById("list");
    let listFilter = document.getElementById("listFilter");
    if (fs.existsSync(fundNames)) {
        let listData = fs.readFileSync(fundNames, 'utf8').split(",");
        list.innerHTML = "";
        listFilter.innerHTML = "";
        listFilter.options.add(new Option("", ""));
        for (i of listData) {
            if (i) {
                list.options.add(new Option(i, i));
                listFilter.options.add(new Option(i, i));
            }
        }
    }
}

window.onload = function () {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    loadSelect();
    loadRecords();
    let dt = new Date();
    document.getElementById("date").value = dt.getFullYear() + "" + PrefixZero(dt.getMonth() + 1, 2) + "" + PrefixZero(dt.getDate(), 2);
    console.log(fundNames);
}

//生成uuid
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

//数字固定位数前补0  num:数字 n:位数
function PrefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

//已购天数
function purchaseDays(startDate) {
    let startDt = new Date();
    startDt.setFullYear(startDate.substr(0, 4));
    startDt.setMonth(startDate.substr(4, 2) - 1);
    startDt.setDate(startDate.substr(6, 2));
    date1 = Date.parse(startDt);
    date2 = Date.parse(new Date());
    let time = Math.floor(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));
    return time;
}
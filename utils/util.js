var getMobileText = function(mobile){
	if(!mobile || mobile.length != 11){
		return '';
	}
	return mobile.slice(0, 3) + ' ' + mobile.slice(3, 7) + ' ' + mobile.slice(7);
};

var formateDate = function(millisec){
	if (!millisec){
		return "";
	}
	var date = new Date(millisec);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var second = date.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (second < 10) {
		second = "0" + second;
	}
	return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + second;
};

var getRectTimeText = function(millisec){
	var d1 = new Date(millisec);
	var d2 = new Date();
	var d1Day = d1.getDate();
	var d2Day = d2.getDate();
	var d1Hours = d1.getHours();
	var d2Hours = d2.getHours();
	var d1Min = d1.getMinutes();
	var d2Min = d2.getMinutes();
	var discrepancy = "";

	if(d2.getFullYear() != d1.getFullYear() || d1.getMonth() != d2.getMonth()){
		return formateDate(millisec);
	}
	
	if(d1Day != d2Day){
		discrepancy = Math.ceil(d2Day - d1Day);
		if(1 == discrepancy){
			return '昨天';
		}
		return `${discrepancy}天前`;
	}
	
	if(d1Hours != d2Hours){
		discrepancy = Math.ceil(d2Hours - d1Hours);
		return `${discrepancy}小时前`;
	}

	if(d1Min != d2Min){
		discrepancy = Math.ceil(d2Min - d1Min);
		return `${discrepancy}分钟前`;
	}

	return '刚刚';
};

module.exports = {
	getMobileText: getMobileText,
	formateDate: formateDate,
	getRectTimeText: getRectTimeText
}

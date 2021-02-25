const apiVersion = "1.0";
let scriptProperties = PropertiesService.getScriptProperties();
let startTime = new Date();
startTime = encodeURIComponent(startTime.toISOString());
let endTime = scriptProperties.getProperty('lastRan');
const SQSP_PARAMS = {
  "Method" : 'GET',
  "headers" : {
    "Authorization": `Bearer ${SQSP_KEY}`,
    "User-Agent": "GoogleAppsScriptOrderCheck",
    "muteHttpExceptions": true
  }
};

function urlCall(url,params, allResults = []) {
  const jsonResult = JSON.parse(UrlFetchApp.fetch(url,params).getContentText());
  allResults = allResults.concat(jsonResult.result);
  if (jsonResult.pagination.nextPageUrl) {
    allResults = urlCall(jsonResult.pagination.nextPageUrl, params, allResults);
  }
  return allResults;
}

function getMissingSqspOrders() {
  //scriptProperties.setProperty('lastRan', startTime);
  startTime = encodeURIComponent("2020-12-01T00:00:00.000Z");
  endTime = encodeURIComponent("2021-02-24T14:48:00.000Z");
  let allOrders = urlCall(`https://api.squarespace.com/${apiVersion}/commerce/orders?modifiedAfter=${startTime}&modifiedBefore=${endTime}`,SQSP_PARAMS);
  allOrders = allOrders.filter(order => !order.shippingAddress.postalCode);
  console.log(allOrders)
  return allOrders;
}

function makeShipstationOrder(order) {
  const newOrder = ShipstationOrder()
  
}

function getShipstationData(endpoint, filters) {
  var root = 'ssapi.shipstation.com';
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'Basic '
    }
  };
  
  var response = UrlFetchApp.fetch(root+endpoint+filters, params);
  var data = response.getContentText();
  return JSON.parse(data);
}

function test () {
  makeShipstationOrder(exampleOrder);
}


class ShipstationOrder {
  constructor(orderNumber, orderDate,paymentDate,orderStatus,customerEmail,billTo,shipTo,items,amountPaid,taxAmount,shippingAmount,customerNotes,requestedShippingService,weight,dimensions) {
    this.orderNumber = orderNumber,
    this.orderDate = orderDate;
    this.paymentDate = paymentDate;
    this.orderStatus = orderStatus;
    this.customerEmail = customerEmail;
    this.billTo = billTo;
    this.shipTo = shipTo;
    this.items = items;
    this.amountPaid = amountPaid;
    this.taxAmount = taxAmount;
    this.shippingAmount = shippingAmount;
    this.customerNotes = customerNotes; //split by newline for q and a
    this.requestedShippingService = requestedShippingService;
    this.weight = weight;
    this.dimensions = dimensions;
  }
}



//GET https://api.squarespace.com/{api-version}/commerce/orders?modifiedAfter={a-datetime}&modifiedBefore={b-datetime}
//ISO 8601 UTC date and time string, e.g. YYYY-MM-DDThh:mm:ss.sZ
//For the date, use new Date and toISOString()
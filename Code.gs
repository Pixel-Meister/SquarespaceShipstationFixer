/*let scriptProperties = PropertiesService.getScriptProperties();
let startTime = new Date();
startTime = encodeURIComponent(startTime.toISOString());
let endTime = scriptProperties.getProperty('lastRan');
scriptProperties.setProperty('lastRan', startTime);
*/

function urlCall(url,params, allResults = []) {
  const jsonResult = JSON.parse(UrlFetchApp.fetch(url,params).getContentText());
  if(jsonResult.hasOwnProperty('result')) {
  allResults = allResults.concat(jsonResult.result);
  } else {
    allResults = jsonResult;
  }
  if (jsonResult.hasOwnProperty('pagination') && jsonResult.pagination.nextPageUrl) {
    allResults = urlCall(jsonResult.pagination.nextPageUrl, params, allResults);
  }
  return allResults;
}

function getMissingSqspOrders() {
  const SQSP_PARAMS = {
    "Method" : 'GET',
    "headers" : {
      "Authorization": `Bearer ${keys.SQSP_KEY}`,
      "User-Agent": "GoogleAppsScriptOrderCheck",
      "muteHttpExceptions": true
    }
  };
  const apiVersion = "1.0";
  startTime = encodeURIComponent("2020-12-01T00:00:00.000Z");
  endTime = encodeURIComponent("2021-02-24T14:48:00.000Z");
  let allOrders = urlCall(`https://api.squarespace.com/${apiVersion}/commerce/orders?modifiedAfter=${startTime}&modifiedBefore=${endTime}`,SQSP_PARAMS);
  allOrders = allOrders.filter(order => !order.shippingAddress.postalCode);
  return allOrders;
}

function getProductInfo(order) {
  const SHPST_PARAMS = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': `Basic ${keys.SHPST_KEY}`
    }
  };
  let allProducts = [];
  order.lineItems.forEach(lineItem => {
    console.log(lineItem.sku)
    const productJson = urlCall(`https://ssapi.shipstation.com/products?sku=${lineItem.sku}`,SHPST_PARAMS);
    allProducts.push(productJson.products[0]);
  })
  return allProducts;
}

function test () {
  console.log(getProductInfo(exampleOrder))
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
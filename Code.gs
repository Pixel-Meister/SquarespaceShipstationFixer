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

function getMissingSqspOrders(startTime, endTime) {
  const SQSP_PARAMS = {
    "Method" : 'GET',
    "headers" : {
      "Authorization": `Bearer ${keys.SQSP_KEY}`,
      "User-Agent": "GoogleAppsScriptOrderCheck",
      "muteHttpExceptions": true
    }
  };
  const apiVersion = "1.0";
  let allOrders = urlCall(`https://api.squarespace.com/${apiVersion}/commerce/orders?modifiedAfter=${startTime}&modifiedBefore=${endTime}`,SQSP_PARAMS);
  allOrders = allOrders.filter(order => !order.shippingAddress.postalCode && order.fulfillmentStatus == "PENDING");
  return allOrders;
}

function shipstationOrderMaker (order) {
  var items = order.lineItems.map(item => new ShipstationOrderItem(item.sku,item.productName,item.weight,item.quantity,item.unitPricePaid,false,null));
  var discounts = order.discountLines.map(discount => new ShipstationOrderItem('',discount.name,null,1,-Math.abs(discount.amount.value),true,'Discount'));
  var orderItems = [...items,...discounts];

  return new ShipstationOrder(
    order.orderNumber,
    order.createdOn,
    order.createdOn,
    order.fulfillmentStatus,
    order.customerEmail,
    //Billing address
    new ShipstationAddress( 
      order.billingAddress.firstName + order.billingAddress.lastName,
      '',
      order.billingAddress.address1,
      order.billingAddress.address2,
      '',
      order.billingAddress.city,
      order.billingAddress.state,
      order.billingAddress.postalCode,
      order.billingAddress.phone
    ),
    //Shipping address
    new ShipstationAddress( 
      order.shippingAddress.firstName + order.shippingAddress.lastName,
      '',
      order.shippingAddress.address1,
      order.shippingAddress.address2,
      '',
      order.shippingAddress.city,
      order.shippingAddress.state,
      order.shippingAddress.postalCode,
      order.shippingAddress.phone
    ),
    //Order items
    orderItems,
    order.grandTotal.value, //Uses Squarespace's currency
    order.taxTotal.value,
    order.shippingTotal.value,
    order.formSubmission, //obj with label, value
    order.shippingLines[0].method,
    )
}

function fixMissingOrders(startTime, endTime) {
  let missingOrders = [];
  let createdOrderNumbersArray = JSON.parse(ScriptProperties.getProperty(createdOrderNumbers));
  getMissingSqspOrders(startTime, endTime)
  .filter(order => !createdOrderNumbersArray.includes(order.orderNumber))
  .forEach(order => {missingOrders.push(shipstationOrderMaker(order))});
  return missingOrders;
}

function main () {
  let scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'lastRan': currentTime,
    'currentTime' : new Date()
  })
  const SHPST_PARAMS = {
    'method': 'POST',
    'muteHttpExceptions': true,
    'headers' : {
      'Authorization': `Basic ${keys.SHPST_KEY}`
    },
    'body' : fixMissingOrders(encodeURIComponent(lastRan.toISOString()),encodeURIComponent(currentTime.toISOString()))
  }

  const result = JSON.parse(UrlFetchApp.fetch('ssapi.shipstation.com/orders/createorders',SHPST_PARAMS).getContentText());
  if(result.hasErrors == True) {
    console.log('There was an error: ' + result.results.toString())}
  if(results.results) {
    scriptProperties.setProperty('createdOrderNumbers', result.results.map(createdOrder => createdOrder.orderNumber).toString())};
  }

//GET https://api.squarespace.com/{api-version}/commerce/orders?modifiedAfter={a-datetime}&modifiedBefore={b-datetime}
//ISO 8601 UTC date and time string, e.g. YYYY-MM-DDThh:mm:ss.sZ
//For the date, use new Date and toISOString()
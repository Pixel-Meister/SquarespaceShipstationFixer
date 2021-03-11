function runForFirstRun () {
  PropertiesService.getScriptProperties().setProperty('createdOrderNumbers',JSON.stringify([01, 1, 52]));
  PropertiesService.getScriptProperties().setProperty('lastRan',"2021-03-05T16:54:05.214Z");
  PropertiesService.getScriptProperties().setProperty('currentTime',"2021-03-01T16:54:05.214Z");
}

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

function customerNotesFormatter(squarespaceForm){
  squarespaceForm = [{"label":"How did you hear about us?","value":"VBS Missions Project"},{"label":"How did you hear about us?","value":"VBS Missions Project"},{"label":"How did you hear about us?","value":"VBS Missions Project"}];
  let customerNotes = "";
  for(i = 0; i < squarespaceForm.length; i++) {
    customerNotes = customerNotes.concat(Object.values(squarespaceForm[0]).join('/n'));
    if(squarespaceForm[i+1]) {
      customerNotes = customerNotes.concat('/n/n');
    }
  }
  return customerNotes
}

function shipstationOrderMaker (order) {
  var items = order.lineItems.map(item => new ShipstationOrderItem(item.sku,item.productName,item.weight,item.quantity,Math.abs(item.unitPricePaid.value),false,null));
  var discounts = order.discountLines.map(discount => new ShipstationOrderItem('',discount.promoCode,0,1,-Math.abs(discount.amount.value),true,'Discount'));
  var orderItems = [...items,...discounts];
  const billTo = order.billingAddress.firstName ? shipstationAddressMaker('billingAddress',order) : shipstationAddressMaker('shippingAddress',order)
  return new ShipstationOrder(
    order.orderNumber,
    order.createdOn,
    order.createdOn,
    'awaiting_shipment',
    order.customerEmail,
    billTo,
    shipstationAddressMaker('shippingAddress',order),
    orderItems,
    parseFloat(order.grandTotal.value), //Uses Squarespace's currency
    parseFloat(order.taxTotal.value),
    parseFloat(order.shippingTotal.value),
    customerNotesFormatter(order.formSubmission),
    order.shippingLines[0].method
    );
}

function shipstationAddressMaker (type,order) {
  return new ShipstationAddress( 
      `${order[type].firstName} ${order[type].lastName}`,
      '',
      order[type].address1,
      order[type].address2,
      '',
      order[type].city,
      order[type].state,
      '00000',
      order[type].countryCode,
      order[type].phone,
      null
    )
}

function fixMissingOrders(startTime, endTime) {
  let missingOrders = [];
  let createdOrderNumbersArray = JSON.parse(PropertiesService.getScriptProperties().getProperty('createdOrderNumbers'));
  getMissingSqspOrders(startTime, endTime)
  .filter(order => !createdOrderNumbersArray.includes(order.orderNumber))
  .forEach(order => {missingOrders.push(shipstationOrderMaker(order));});
  if(missingOrders == false) {throw 'No missing orders'}
  return missingOrders;
}

function main () {
  const lastRan = '2021-03-05T18:23:31.328Z' //PropertiesService.getScriptProperties().getProperty('currentTime');
  let now = new Date();
  now = now.toISOString();
  PropertiesService.getScriptProperties().setProperties({
    'lastRan' : lastRan,
    'currentTime' : now
  });
  const SHPST_PARAMS = {
    'method': 'POST',
    'muteHttpExceptions': true,
    'contentType' : 'application/json',
    'headers' : {
      'Authorization': `Basic ${keys.SHPST_KEY}`
    },
    'payload' : JSON.stringify(fixMissingOrders(encodeURIComponent(lastRan),encodeURIComponent(now)))
  };
  console.log(SHPST_PARAMS.payload);

  const result = UrlFetchApp.fetch('https://ssapi.shipstation.com/orders/createorders',SHPST_PARAMS).getContentText();
  console.log(result);
  if(result.hasErrors == true) {
    console.log('There was an error: ' + result.results.toString());}
  if(result.results) {
    PropertiesService.getScriptProperties().setProperty('createdOrderNumbers', JSON.stringify(result.results.map(createdOrder => createdOrder.orderNumber)));}
}

function mainWrapper () {
    try {
      main();
    } catch (error) {
      console.log(error)
    }
}
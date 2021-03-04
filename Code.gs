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
  allOrders = allOrders.filter(order => !order.shippingAddress.postalCode && order.fulfillmentStatus == "PENDING");
  return allOrders;
}

function ShipstationOrderMaker (order) {
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

function test () {
  const SHPST_PARAMS = {
    'method': 'POST',
    'muteHttpExceptions': true,
    'headers' : {
      'Authorization': `Basic ${keys.SHPST_KEY}`
    },
    'body' : fixMissingOrders()
  }

  //console.log(UrlFetchApp.fetch('ssapi.shipstation.com/orders/createorders',SHPST_PARAMS).getContentText());
  }

function fixMissingOrders() {
  let missingOrders = [];
  getMissingSqspOrders().forEach(order => {missingOrders.push(ShipstationOrderMaker(order))});
  return missingOrders;
}

//GET https://api.squarespace.com/{api-version}/commerce/orders?modifiedAfter={a-datetime}&modifiedBefore={b-datetime}
//ISO 8601 UTC date and time string, e.g. YYYY-MM-DDThh:mm:ss.sZ
//For the date, use new Date and toISOString()
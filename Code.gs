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
    //console.log(lineItem.sku)
    const productJson = urlCall(`https://ssapi.shipstation.com/products?sku=${lineItem.sku}`,SHPST_PARAMS);
    allProducts.push(productJson.products[0]);
  })
  return allProducts;
}

function shipstationItemMaker(item) {
  return new ShipstationOrderItem(
    item.id,
    item.sku,
    item.productName,
    item.imageUrl,
    item.weight,
    item.quantity,
    item.unitPricePaid.value,
    null,
    null,
    null,
    item.options,
    item.productId, //lookup from all products
    null,
    false,
    null)
}

function ShipstationOrderMaker (order) {
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
    new ShipstationOrderItem, //function
    order.grandTotal.value, //Uses Squarespace's currency
    order.taxTotal.value,
    order.shippingTotal.value,
    order.formSubmission, //obj with label, value
    order.shippingLines[0].method,
    )
}

function test () {
  //console.log(getProductInfo(exampleOrder));
  //console.log(ShipstationOrderMaker(exampleOrder));
  console.log(exampleOrder.lineItems[0]);
  
}

//GET https://api.squarespace.com/{api-version}/commerce/orders?modifiedAfter={a-datetime}&modifiedBefore={b-datetime}
//ISO 8601 UTC date and time string, e.g. YYYY-MM-DDThh:mm:ss.sZ
//For the date, use new Date and toISOString()
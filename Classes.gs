//https://www.shipstation.com/docs/api/orders/create-update-order/#example-request
class ShipstationOrder {
  constructor(orderNumber, orderDate,paymentDate,orderStatus,customerEmail,billTo,shipTo,items,amountPaid,taxAmount,shippingAmount,customerNotes,requestedShippingService) {
    this.orderNumber = orderNumber;
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
  }
}

//https://www.shipstation.com/docs/api/models/address/
class ShipstationAddress {
  constructor(name, company, street1, street2, street3, city, state, postalCode, country, phone, residential) {
    this.name;
    this.company;
    this.street1;
    this.street2;
    this.street3;
    this.city;
    this.state;
    this.postalCode;
    this.country;
    this.phone;
    this.residential;
  }
}

//https://www.shipstation.com/docs/api/models/order-item/
class ShipstationOrderItem {
  constructor(lineItemKey,sku,name,imageUrl,weight,quantity,unitPrice,taxAmount,shippingAmount,warehouseLocation,options,productId,fulfillmentSku,adjustment,upc) {
    this.orderItemId = null
    this.lineItemKey = lineItemKey;
    this.sku = sku;
    this.name = name;
    this.imageUrl = imageUrl;
    this.weight = {
      "value" : weight,
      "units" : "pounds",
    };
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.taxAmount = taxAmount;
    this.shippingAmount = shippingAmount;
    this.warehouseLocation = warehouseLocation;
    this.options = options;
    this.productId = productId;
    this.fulfillmentSku = fulfillmentSku;
    this.adjustment = adjustment;
    this.upc = upc;
    this.createDate = null;
    this.modifyDate = null;
  }
}
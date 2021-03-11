//https://www.shipstation.com/docs/api/orders/create-update-order/#example-request
class ShipstationOrder {
  constructor(orderNumber, orderDate,paymentDate,orderStatus,customerEmail,billTo,shipTo,items,amountPaid,taxAmount,shippingAmount,customerNotes,requestedShippingService) {
    this.orderNumber = orderNumber;
    this.orderKey = null;
    this.orderDate = orderDate;
    this.paymentDate = paymentDate;
    this.shipByDate = null;
    this.orderStatus = orderStatus;
    this.customerId = null;
    this.customerUsername = null;
    this.customerEmail = customerEmail;
    this.billTo = billTo;
    this.shipTo = shipTo;
    this.items = items;
    this.amountPaid = amountPaid;
    this.taxAmount = taxAmount;
    this.shippingAmount = shippingAmount;
    this.customerNotes = customerNotes; //split by newline for q and a
    this.internalNotes = null;
    this.gift = null;
    this.giftMessage = null;
    this.paymentMethod = null;
    this.requestedShippingService = requestedShippingService;
    this.carrierCode = null;
    this.serviceCode = null;
    this.packageCode = null;
    this.confirmation = null;
    this.shipDate = null;
    this.weight = {'value':0,'units':'pounds'};
    this.dimensions = {'length': 0,'width':0,'height':0,'units':'inches'};
    this.insuranceOptions = {'provider':'carrier','insureShipment':false,'insuredValue':0};
    this.internationalOptions = {'contents':null,'customsItems':null,'nonDelivery':null};
    this.advancedOptions = {"warehouseId":null,"nonMachinable":false,"saturdayDelivery":null,"containsAlcohol":false,"mergedOrSplit":false,"mergedIds":[],"parentId":null,"storeId":null,"customField1":null,"customField2":null,"customField3":null,"source":null,"billToParty":null,"billToAccount":null,"billToPostalCode":null,"billToCountryCode":null};
    this.tagIds = [];
  }
}

//https://www.shipstation.com/docs/api/models/address/
class ShipstationAddress {
  constructor(name, company, street1, street2, street3, city, state, postalCode, country, phone, residential) {
    this.name = name;
    this.company = company;
    this.street1 = street1;
    this.street2 = street2;
    this.street3 = street3;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.phone = phone;
    this.residential = residential;
  }
}

//https://www.shipstation.com/docs/api/models/order-item/
class ShipstationOrderItem {
  constructor(sku,name,weight = 0,quantity,unitPrice,adjustment,lineItemKey) {
    this.lineItemKey = lineItemKey;
    this.sku = sku;
    this.name = name;
    this.imageUrl = null;
    this.weight = {
      "value" : parseFloat(weight),
      "units" : "pounds",
    };
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.taxAmount = null;
    this.shippingAmount = null;
    this.warehouseLocation = null;
    this.options = [];
    this.productId = null;
    this.fulfillmentSku = null;
    this.adjustment = adjustment;
    this.upc = null;
  }
}
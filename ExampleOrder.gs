//Squarespace order example
const exampleOrder = {
      "id": "600f3782be34535f39c6e6f9",
      "orderNumber": "3618",
      "createdOn": "2021-01-25T21:26:26.134Z",
      "modifiedOn": "2021-02-18T21:06:44.121Z",
      "channel": "web",
      "testmode": false,
      "customerEmail": "kayla@becauseinternational.org",
      "billingAddress": {
        "firstName": "",
        "lastName": "",
        "address1": null,
        "address2": null,
        "city": null,
        "state": null,
        "countryCode": "US",
        "postalCode": null,
        "phone": ""
      },
      "shippingAddress": {
        "firstName": "Rashadi",
        "lastName": "Foundation",
        "address1": "Mufti Shabil Ali Mosque",
        "address2": "LP# 18 Madras Road",
        "city": "St Helena Village, Piarco",
        "state": "West Indies",
        "countryCode": "TT",
        "postalCode": null,
        "phone": "000-000-0000"
      },
      "fulfillmentStatus": "FULFILLED",
      "lineItems": [
        {
          "id": "600f36dfddc0071b7122a725",
          "variantId": "b5da0598-b6ca-49fb-969e-e141d8f55732",
          "sku": "SQ2700585",
          "weight": 0.94,
          "width": 3.0,
          "length": 9.5,
          "height": 4.5,
          "productId": "5f849ec1e8efb02be97f4adf",
          "productName": "Classic Black (Ethiopia)",
          "quantity": 30,
          "unitPricePaid": {
            "value": "14.00",
            "currency": "USD"
          },
          "variantOptions": [
            {
              "optionName": "Size",
              "value": "Youth Large"
            }
          ],
          "customizations": [
            {
              "label": "Limited Use",
              "value": "I understand and accept the Limited Use Agreement"
            }
          ],
          "imageUrl": "https://static1.squarespace.com/static/5b60a7fbb98a785014ec8b6f/5beca3cc40ec9a9fc5fc4647/5f849ec1e8efb02be97f4ae1/1607399921589/black-shoes.jpg?format=300w",
          "lineItemType": "PHYSICAL_PRODUCT"
        },
        {
          "id": "600f36f3a881b6174965226e",
          "variantId": "be5f634f-61c6-4a4f-a9cc-5e0c4b51ea23",
          "sku": "SQ4121580",
          "weight": 1.31,
          "width": 4.5,
          "length": 11.0,
          "height": 4.0,
          "productId": "5c803ca7c830259b7d167804",
          "productName": "The Shoe That Grows: Black",
          "quantity": 30,
          "unitPricePaid": {
            "value": "20.00",
            "currency": "USD"
          },
          "variantOptions": [
            {
              "optionName": "Size",
              "value": "XLarge"
            },
            {
              "optionName": "Origin",
              "value": "United States"
            }
          ],
          "customizations": [
            {
              "label": "Limited Use",
              "value": "I understand and accept the Limited Use Agreement"
            }
          ],
          "imageUrl": "https://static1.squarespace.com/static/5b60a7fbb98a785014ec8b6f/5beca3cc40ec9a9fc5fc4647/5c819ac1971a1838179aef17/1582741561193/newshoe_black_side.jpg?format=300w",
          "lineItemType": "PHYSICAL_PRODUCT"
        },
        {
          "id": "600f36fb602723295f6b196d",
          "variantId": "76e95c4d-215b-4b38-9ef7-863dbd63ae55",
          "sku": "SQ6167626",
          "weight": 0.6,
          "width": 3.5,
          "length": 7.5,
          "height": 3.5,
          "productId": "5c803ca7c830259b7d167804",
          "productName": "The Shoe That Grows: Black",
          "quantity": 40,
          "unitPricePaid": {
            "value": "20.00",
            "currency": "USD"
          },
          "variantOptions": [
            {
              "optionName": "Size",
              "value": "Small"
            },
            {
              "optionName": "Origin",
              "value": "United States"
            }
          ],
          "customizations": [
            {
              "label": "Limited Use",
              "value": "I understand and accept the Limited Use Agreement"
            }
          ],
          "imageUrl": "https://static1.squarespace.com/static/5b60a7fbb98a785014ec8b6f/5beca3cc40ec9a9fc5fc4647/5c819ac1971a1838179aef17/1582741561193/newshoe_black_side.jpg?format=300w",
          "lineItemType": "PHYSICAL_PRODUCT"
        }
      ],
      "internalNotes": [
      ],
      "shippingLines": [
        {
          "method": "DHL International (14–17 Business Days)",
          "amount": {
            "value": "289.00",
            "currency": "USD"
          }
        }
      ],
      "discountLines": [
        {
          "name": "Stepping Stones Shoes ",
          "description": "Stepping Stones Shoes ",
          "amount": {
            "value": "1820.00",
            "currency": "USD"
          },
          "promoCode": "STEPPINGSTONES100"
        },
        {
          "name": "Manual Order Shipping",
          "description": "Manual Order Shipping",
          "amount": {
            "value": "289.00",
            "currency": "USD"
          },
          "promoCode": "MANUALORDERSHIPPING"
        }
      ],
      "formSubmission": [
        {
          "label": "How did you hear about us?",
          "value": "Other"
        }
      ],
      "fulfillments": [
        {
          "shipDate": "2021-02-18T21:06:43.800Z",
          "carrierName": "FedEx",
          "service": null,
          "trackingNumber": "772920704021",
          "trackingUrl": "https://www.fedex.com/Tracking?action=track&tracknumbers=772920704021"
        }
      ],
      "subtotal": {
        "value": "1820.00",
        "currency": "USD"
      },
      "shippingTotal": {
        "value": "289.00",
        "currency": "USD"
      },
      "discountTotal": {
        "value": "2109.00",
        "currency": "USD"
      },
      "taxTotal": {
        "value": "0.00",
        "currency": "USD"
      },
      "refundedTotal": {
        "value": "0.00",
        "currency": "USD"
      },
      "grandTotal": {
        "value": "0.00",
        "currency": "USD"
      },
      "channelName": "Squarespace",
      "externalOrderReference": null,
      "fulfilledOn": "2021-02-18T21:06:44.120Z",
      "priceTaxInterpretation": "EXCLUSIVE"
    }
# README # Fast Salesforce Commerce Cloud Cartridge


### What is this repository for? ###

Fast payment Integrations for SFCC

### How do I get set up? ###

1. Setup of Business Manager
2. Custom Code
3. Testing
4. Business Manager User Guide

Refer sfcc_cartridge/<a href="https://github.com/fast-af/sfcc-integration/raw/master/sfcc_cartridge/Fast-LINK%20Integration-SFRA.pdf">Fast-LINK Integration-SFRA.pdf</a> and/or do below steps,

1. Setup of Business Manager

Install Cartridge:
Add int_fast_sfra cartridge into UX Studio through file import and add the same into the cartridge path.

Add Cartridge Path:
Login into BM and navigate to  Administration > Sites > Manage Sites 
In the Setting tab, add int_fast_sfra in the cartridge path and Apply
Data Import :
Import Custom attribute:

In order to support Fast Checkout we will add custom attributes to the below Object using the metadata file “system-objecttype-extensions.xml”:

Basket
Order
OrderAddress
Product
ProductLineItem
Site Preferences

Import Steps:
In BM, Navigate to Administration >  Site Development >  Import & Export > Manage Import Files 
Find the “system-objecttype-extensions.xml” under “metadata/fast-meta-import/meta” and upload the file using Import & Export Files
Navigate to Administration >  Site Development >  Import & Export  
Click import under Meta Data
Select Import File: Select the uploaded “system-objecttype-extensions.xml” file and click Next
Import File Validation: click refresh to validate the file
Import: Click Import after validation is successful

Import Payment:

In order to support Fast Checkout, will add a new payment method via import

Import Steps:
In BM, Navigate to “Merchant Tools >  Ordering >  Import & Export” 
Upload the “metadata/sites/RefArch/payment-methods.xml” file through Import and Export Files



Configuration

Fast require below configurations steps
Create Account / Credentials
SFCC BM Configurations 
Fast Configurations


Step #1: Create Account / Credentials

To establish the connection between Fast and SFCC, Fast needs both Fast ID and SFCC BM accounts, below steps will help for the same
Fast Id and Access Token
SFCC BM user
SFCC Client

Fast Id and Access Token
These Fast Credentials will help to connect the Fast from SFCC and Submit a Fast support ticket to create an App Id and Access token 
Navigate to: https://help.fast.co/hc/en-us 
Click SUBMIT A REQUEST

Enter your email address
Subject: 
Salesforce Commerce Cloud App Id and Token Request

Description:
[company name]

Hi, I am working on an integration between Fast and Salesforce Commerce Cloud. I am requesting a Fast App Id and token in order to complete the necessary configurations.

Thank you,

[Your Name]


Click SUBMIT





SFCC BM user
SFCC BM users will help to connect SFCC OCAPI from Fast
In BM, Navigate to  Administration >  Organization >  Users and Create a New BM user
Prefer to have a common email to create the BM user instead of a specific email Id (example: fast-integration-user@[yourcompany].com)

SFCC Client
SFCC client Id will help control the access of OCAPI from outside and call the OCAPI from Fast
In SFCC account Manager, Add new Client and obtain the Client ID and Password
Community tool for checking OCAPI settings: http://ocapi-settings-with-ease.herokuapp.com/

Step #2: SFCC BM Configurations

SFCC BM requires below configurations
Custom Preference
Open Commerce API Settings 

Custom Preference 
In BM, Navigate to “Merchant Tools > Site Preferences > Custom Site Preference Groups” and open Fast Config.

Fast JS URL
This config will help to connect Fast from your Storefront 
Attribute type: String
Possible values are 
Sandbox - https://js.sandbox.fast.co/fast.js
Production - https://js.fast.co/fast.js
Is Fast Enabled
This config will help to Turn On / Off the Fast button at the site level
Attribute type: Boolean
Fast AppId
This config will help to hold the Fast App Id 
Attribute type: String
This value is obtained in Step #1 from Fast support
Fast Theme
This config will help to  configure the Fast button theme
Attribute type: String
Possible values are 
None (light)
Dark


Open Commerce API Settings 
In BM, Navigate to “Administration >  Site Development >  Open Commerce API Settings”, select Shop Type and Global Context
Add below setting under “Clients” after adding the SFCC client ID

{
   "_v":"18.7",
   "clients":[
      {
         "client_id":"<<client_id>>",
         "resources":[
            {
               "resource_id":"/baskets",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "cache_time":0,
               "methods":[
                  "post"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "cache_time":0,
               "methods":[
                  "get",
                  "delete",
                  "patch"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/items",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "post"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/items/{item_id}",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "patch",
                  "delete"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/notes",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "get",
                  "post"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/customer",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "put"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/shipments",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "post"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/shipments/{shipment_id}",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "patch",
                  "delete"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/shipments/{shipment_id}/shipping_method",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "put"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/shipments/{shipment_id}/shipping_address",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "put"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/billing_address",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "put"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/coupons",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "post"
               ]
            },
            {
               "resource_id":"/baskets/{basket_id}/coupons/{coupon_item_id}",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "delete"
               ]
            },
            {
               "resource_id":"/customers",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "post"
               ]
            },
            {
               "resource_id":"/customers/{customer_id}",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "get",
                  "patch"
               ]
            },
            {
               "resource_id":"/orders",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "post"
               ]
            },
            {
               "resource_id":"/orders/{order_no}",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "methods":[
                  "get",
                  "patch"
               ]
            },
            {
               "resource_id":"/products/{id}/images",
               "read_attributes":"(**)",
               "write_attributes":"(**)",
               "cache_time":0,
               "methods":[
                  "get"
               ]
            }
         ]
      }
   ]
}






Step #3: Fast Configurations
Navigate to the Fast account page and update the below settings
Submit a Fast support ticket sharing the client id and password created in the previous step as well as your Business Manager integration user’s username and password

2. Custom Code

Customize the below pages to show the Fast checkout button. Include custom ISML files into site-specific Storefront Base or App Storefront Base Cartridge ISML files:
PDP
Cart
Minicart
 
Add htmlHead
Add given code into “cartridge/templates/default/common/layout/page.isml”  after <isinclude template="/common/htmlHead" /> line

<isset name="isFastEnabled" value="${dw.system.Site.getCurrent().getCustomPreferenceValue('isFastEnabled')}" scope="page" />
<isset name="fastJsUrl" value="${dw.system.Site.getCurrent().getCustomPreferenceValue('fastJsUrl')}" scope="page" />
<isif condition="${isFastEnabled && fastJsUrl !== null}">
  <script src="${fastJsUrl}"></script>
</isif>


Add for Product detail Page
Add given code in cartridge/templates/default/product/productDetails.isml above the <insinclude template="product/components/addToCartProduct"> line

<div class="row">
         <isinclude template="product/fast/fastCheckoutProduct" /> 
</div>



Add for Cart Page
Add given code in cartridge/templates/default/cart/cart.isml  below the <isinclude template="cart/cartTotals" /> line

<isinclude template="common/components/fastCheckoutRenderCart" />




Add for Mini Cart
Add given code in cartridge/templates/default/checkout/cart/miniCart.isml as  first line in <div class="minicart-footer"> line

<isinclude template="common/components/fastCheckoutRenderCart" />


3. Testing
Checkout Flow Integration Tests

Positive Test Cases:
Create cart
Read cart
Update cart with new
shipment details
shipping option
billing details
coupon
line items
status
convert card to order
Delete cart

Negative Test Cases:
Create cart fails for invalid input
Read cart fails for invalid input
Read cart fails when order is missing
Update cart fails for invalid input (each field represents a separate test)
Update cart fails when order is missing
Delete cart fails for invalid input
Delete cart fails when order is missing
Seller -> Fast Integration Tests
Positive Test Cases:
Cancel order
Refund order
Send a business event
Order was fulfilled
Order was cleared, notify to collect payment

Negative Test Cases:
Cancel order fails for invalid input
Cancel order fails for cancelled/missing order
Refund order fails for invalid input
Refund order fails for already refunded/missing order
Send business event should fail for invalid event data

Business Manager Configuration Tests
Product level Fast button configuration
Disable Fast Checkout = -None-; result: button show on storefront
Disable Fast Checkout = False; result: button shown on storefront
Disable Fast Checkout = True; result: button hidden from storefront
Site level Fast button configuration
Is Fast Enabled = True; result: button is eligible to be displayed on storefront
Is Fast Enabled = False; result: button is ineligible to be displayed on storefront
  
4. Business Manager User Guide
Enable Fast Payment
Users can enable Fast  payment in the below levels
Site Level
Product Level 
Cart / Mini Cart

Site Level
The fast checkout button can be enabled at the Site level by below steps
In BM, Navigate to “Merchant Tools > Site Preferences > Custom Site Preference Groups” and open Fast Config
Use the “Is Fast Enabled” attribute to enable and disable the Fast Button

Product Level 
Users can Disable the Fast button on the Product level by below steps
In BM, Navigate to “Merchant Tools >  Products and Catalogs >  Products “.
Search and open a Product. 
In general tab, set Yes in Disable Fast Checkout to disable/hide the button on the Product page


Cart / Mini Cart:
If any of the products in Cart are disabled the Fast checkout, the Fast checkout button will not be visible on the Cart and Mini Cart page

Storefront Functionality

After successfully enable the Fast button in Site and Product level, the Fast button will be displayed on the below pages 
PDP
Cart
Mini Cart

### Who do I talk to? ###

https://help.fast.co/hc/en-us 



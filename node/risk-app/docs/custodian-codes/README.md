Local Custodian Codes in AddressBase
====================================

The file [addressbase-products-local-custodian-codes.zip](addressbase-products-local-custodian-codes.zip) details the 381 current local custodian codes along with their respective country (Eng/Scot/Wales) being used within the AddressBase products.

It can be found online here:

https://www.ordnancesurvey.co.uk/business-and-government/help-and-support/products/addressbase.html
https://www.ordnancesurvey.co.uk/docs/product-schemas/addressbase-products-local-custodian-codes.zip


Each individual address returned from the the address base api includes a custodian code.
We lookup this value against the list of custodian codes to ensure the searched address is in England.

The data from OS is in a `.doc` format in the `addressbase-products-local-custodian-codes.zip` in this directory. Copy the contents to the `data.csv` file and run `node create-map.js` to convert the `.csv` to `.json`.
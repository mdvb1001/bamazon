# Bamazon

HW10 - Northwestern Coding Boot Camp 

Bamazon is a two-part CLI (Commnand Line Interface) that mimics the basic mechanics of the massively popular website, Amazon. 

Please view this [video](https://vimeo.com/199404266) for a virtual tour of this app. 

# Install

`Fork` or `Clone` this repository. 

In your command line (inside your repo) make sure to run `npm install` in order to download both node packages needed (inquirer and mysql). 

The next step would be to add some data to your server by using MySQL or any other data modeling application. 

Use the commands in `bamazon_db.sql` to create the appropriate database ("Bamazon"), table ("products") and columns ("id_item", "product_name", "department_name", "price", "stock_quantity"). 

After this, you will need to establish a connection between the machine and the server. Go to `var connection` in `bamazonCustomer.js` and change `password` and `port` to mirror your local machine's settings. You will need to repeat this in your `bamazonManager.js` file. 

Done? Great! You are ready to experience Bamazon!

# How to use 

* Type `node bamazonCustomer.js` to get things rolling with part 1. 

 Here you will be able to buy the products listed in the product list by entering an ID number.
 You can exit this app at anytime by selecting `Exit App`. If you want to shop more, then go for `Shop`.

* Type `node bamazonManager.js` to get to the meat of part 2.

 Here, you will be presented with a menu of awesome commands: 

	* `View Product for Sale`
	* `View Low Inventory`
	* `Add to Inventory`
	* `Add New Product`
	* `Exit App` 
 
 These options are pretty self explanatory.

 `View Low Inventory` will display all products with inventories of 5 or less.

 `Add New Product` will allow you to add a whole new item to the product line. It will ask you to specify the name, department, price and inventory for each new product. 



It's important to note that the menu in both parts will be displayed as soon as you finish running command. This will allow you to experience the full scope of this app without having to the file name repeatedly. 

Have fun. 













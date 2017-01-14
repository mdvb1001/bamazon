// request inquirer 
var inquirer = require('inquirer');
// request mysql package 
var mysql = require('mysql');
// link to key.js file for password of mysql
var key = require('./key.js');
// empty array set up for ID validation 
var idArray = [];
// connection settings
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: key.mysqlKey.password,
    database: 'Bamazon'
});
// establish connection to server   
connection.connect(function (err) {
    if (err) throw err;
    reset().catch(function (err) {
        console.log(err);
    });
});

// function that starts and reset the app (main menu)
function reset() {
    return inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Product for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit App'],
        name: 'menu'
    }]).then(function (answer) {
        // runs function to view products THEN reset main menu runs 
        if (answer.menu === 'View Product for Sale') {
            return viewProducts().then(function () {
                reset();
            });
        // runs function to view the low inventory
        } else if (answer.menu === 'View Low Inventory') {
            return lowInventory();
        // runs function to view Product THEN add to inventory function runs 
        } else if (answer.menu === 'Add to Inventory') {
            return viewProducts().then(function () {
                return addInventory();
            });
        // runs new product function 
        } else if (answer.menu === 'Add New Product') {
            return addNewProduct();
        // runs function to Exit app 
        } else if (answer.menu === 'Exit App') {
            return exitApp();
        }
    });
}

// function to add a new products
function addNewProduct() {
    return inquirer.prompt([{
        name: 'productName',
        type: 'input',
        message: 'Enter Name of New Product',
        validate: function (input) {
            // validate that user entered 'something' at least
            if (input === '') {
                console.log('Error: you must type something!');
                return false;
            } else {
                return true;
            }
        }
    }, {
        name: 'productDepartment',
        type: 'input',
        message: 'Enter Name of Department',
        validate: function (input) {
            // input must be not nothing 
            if (input === '') {
                console.log('\nError: you must type something!');
                return false;
            } else {
                return true;
            }
        }
    }, {
        name: 'productPrice',
        type: 'input',
        message: 'Enter Price for New Product',
        validate: function (input) {
            // input from user must be a number
            if (isNaN(input) !== true) {
                return true;
            } else {
                console.log("\nError: please enter a number");
                return false;
            }
        }
    }, {
        name: 'productQuantity',
        type: 'input',
        message: 'Enter quantity to add to inventory',
        validate: function (input) {
            // input from user must be a number
            if (isNaN(input) !== true) {
                return true;
            } else {
                console.log("\nError: please enter a number");
                return false;
            }
        }
    }]).then(function (answer) {
        // add all inputs form user into server db
        return new Promise(function (success, failure) {
            var newName = answer.productName;
            var newDepartment = answer.productDepartment;
            var newPrice = answer.productPrice;
            var newStock = answer.productQuantity;
            connection.query("INSERT INTO products SET ?", [{
                product_name: newName,
                department_name: newDepartment,
                price: newPrice,
                stock_quantity: newStock
            }], function (err, res) {
                console.log('Added to products: ' + '"' + answer.productName + '"');
                // restet the main menu after adding product... 
                return reset();
            });
        });
    });
}

// function for adding inventory 
function addInventory() {
    return inquirer.prompt([{
        name: 'idOfItem',
        type: 'input',
        message: 'Enter ID of item to add inventory to it',
        validate: function (input) {
            //validation: must be a number, an ID smaller than length of idArray and can't be empty string 
            if ((isNaN(input) !== true) && (input <= idArray.length) && (input !== '')) {
                return true;
            } else {
                console.log("\nError: please enter a valid ID#");
                return false;
            }
        }
    }, {
        name: 'quantityOfItem',
        type: 'input',
        message: 'Enter quantity to add to inventory',
        validate: function (input) {
            // Cannot not be a number
            if (isNaN(input) !== true) {
                return true;
            } else {
                console.log("\nplease enter a number");
                return false;
            }
        }
    }]).then(function (answer) {
        // new Promise to select to THEN select all the ids of table 
        return new Promise(function (success, failure) {
            connection.query("SELECT * FROM products WHERE item_id=?", answer.idOfItem, function (err, res) {
                if (err) failure(err);
                success(res);
            });
        }).then(function (result) {
            // calculate new inventory to send to server 
            var newQuantity = parseInt(result[0].stock_quantity) + parseInt(answer.quantityOfItem);
            connection.query("UPDATE products SET ? WHERE ?", [{
                // set new amoutnt as the stock_quantity for selected item
                stock_quantity: newQuantity
            }, {
                item_id: result[0].item_id
            }], function (err, res) {
                console.log('Inventory for ' + '"' + result[0].product_name + '"' + ' has been increased to ' + newQuantity);
                // reset main menu
                reset();
            });
        }).catch(function (err) {
            console.log(err);
        });
    });
}

// display items function 
function viewProducts() {
    return new Promise(function (success, failure) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw (err);
            success(res);
            // displays every detail for each item 
            for (var i = 0; i < res.length; i++) {
                console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + 'Dept: ' + res[i].department_name + " | " + '$' + res[i].price + " | " + "Qty: " + res[i].stock_quantity);
                idArray.push(res[i].item_id);
            }
        });
    });
}

// display function for items that have inventory lower than 5 
function lowInventory() {
    return new Promise(function (success, failure) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw (err);
            success(res);
            // displays every detail for each item that has inventory lower than 5
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity <= 5) {
                    console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + 'Dept: ' + res[i].department_name + " | " + '$' + res[i].price + " | " + "Qty: " + res[i].stock_quantity);
                }
            }
            return reset();
        });
    });
}

// Destroys connection to server for Exit App
function exitApp() {
    connection.destroy();
    console.log('\nFine! We hope you never come back!');
}
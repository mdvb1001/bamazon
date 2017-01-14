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
    // prompt menu 
    return inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Shop', 'Exit App'],
        name: 'menu'
    }]).then(function (answer) {
        // display items before shopping 
        if (answer.menu === 'Shop') {
            showItems().then(function () {
                return purchasePrompt();
            });
        // this is for exiting the app 
        } else if (answer.menu === 'Exit App') {
            return exitApp();
        }
    });
}
// function for displaying for items
function showItems() {
    return new Promise(function (success, failure) {
        // selects everything in the database 'products'
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw (err);
            success(res);
            for (var i = 0; i < res.length; i++) {
                console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + '$' + res[i].price);
                idArray.push(res[i].item_id);
            }
        });
    });
}

// function for shopping, prompts ID and Quantity input
function purchasePrompt() {
    return inquirer.prompt([{
        name: 'idOfItem',
        type: 'input',
        message: 'Enter ID of item to buy',
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
        message: 'Enter quantity to buy',
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
            // quantity entered must be lower or equal to inventory 
            if (answer.quantityOfItem <= result[0].stock_quantity) {
                // calculate new inventory to send to server 
                var newQuantity = result[0].stock_quantity - answer.quantityOfItem;
                // to display a dollar amount 
                var totalPrice = parseFloat(result[0].price * answer.quantityOfItem).toFixed(2);
                // set new amoutnt as the stock_quantity for selected item
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuantity
                }, {
                    item_id: result[0].item_id
                }], function (err, res) {
                    console.log('Your purchase for $' + totalPrice + ' is complete!');
                    // reset main menu 
                    reset();
                });
            } else {
                // if quantity entered exceeds quantity in inventory 
                console.log('Insufficient Quantity!');
                // reset main menu 
                reset();
            }
        });
    });
}

// Destroys connection to server for Exit App
function exitApp() {
    connection.destroy();
    console.log('\nFine! We hope you never come back!');
}
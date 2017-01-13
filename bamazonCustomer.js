var inquirer = require('inquirer');
var mysql = require('mysql');
var key = require('./key.js');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: key.mysqlKey.password,
    database: 'Bamazon'
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    reset().catch(function (err) {
        console.log(err);
    });
});

function reset() {
    return inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Shop', 'Exit App'],
        name: 'menu'
    }]).then(function (answer) {
        if (answer.menu === 'Shop') {
            showItems().then(function () {
                return purchasePrompt();
            });
        } else if (answer.menu === 'Exit App') {
            return exitApp();
        }
    });
}

function showItems() {
    return new Promise(function (success, failure) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw (err);
            success(res);
            for (var i = 0; i < res.length; i++) {
                console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + '$' + res[i].price);
            }
        });
    });
}

function purchasePrompt() {
    return inquirer.prompt([{
        name: 'idOfItem',
        type: 'input',
        message: 'Enter ID of item to buy',
        validate: function (input) {
            if (isNaN(input) !== true) {
                return true;
            } else {
                console.log("\nplease enter a number");
                return false;
            }
        }
    }, {
        name: 'quantityOfItem',
        type: 'input',
        message: 'Enter quantity to buy',
        validate: function (input) {
            if (isNaN(input) !== true) {
                return true;
            } else {
                console.log("\nplease enter a number");
                return false;
            }
        }
    }]).then(function (answer) {
        return new Promise(function (success, failure) {
            connection.query("SELECT * FROM products WHERE item_id=?", answer.idOfItem, function (err, res) {
                if (err) failure(err);
                success(res);
            });
        }).then(function (result) {
            if (answer.quantityOfItem <= result[0].stock_quantity) {
                var newQuantity = result[0].stock_quantity - answer.quantityOfItem;
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuantity
                }, {
                    item_id: result[0].item_id
                }], function (err, res) {
                    console.log('Your purchase has been complete!');
                    reset();
                });
            } else {
                console.log('Insufficient Quantity!');
                reset();
            }
        });
    });
}

function exitApp () {
    connection.destroy();
}
var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'MySQL5125496',
    database: 'Bamazon'
});
connection.connect(function (err) {
    if (err) throw err;
    reset().then(function (whatever) {
        connection.destroy();
    }).catch(function (err) {
        console.log(err);
    });
});

function reset() {
    return inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Product for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        name: 'menu'
    }]).then(function (answer) {
        if (answer.menu === 'View Product for Sale') {
            return viewProducts();
        } else if (answer.menu === 'View Low Inventory') {
            return lowInventory();
        }
    });
}

function viewProducts() {
    return new Promise(function (success, failure) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw (err);
            success(res);
            for (var i = 0; i < res.length; i++) {
                console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + '$' + res[i].price + " | " + "Quantity: " + res[i].stock_quantity);
            }
        });
    });
}

function lowInventory() {
    return new Promise(function (success, failure) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw (err);
            success(res);
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity <= 5) {
                    console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + '$' + res[i].price + " | " + "Quantity: " + res[i].stock_quantity);
                }
            }
        });
    });
}
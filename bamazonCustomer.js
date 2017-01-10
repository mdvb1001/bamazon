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
    console.log("connected as id " + connection.threadId);
});

reset();

function reset() {
    showItems().then(function () {
        return purchasePrompt();
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
    }, {
        name: 'quantityOfItem',
        type: 'input',
        message: 'Enter quantity to buy'
    }]).then(function (answer) {
        return new Promise(function (success, failure) {
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw (err);
                success(res);
                if (answer.quantityOfItem <= res[answer.idOfItem].stock_quantity) {
                    console.log('Good!');
                } else {
                    console.log('Insufficient Quantity!');
                    reset();
                }
            });
        });
    });
}
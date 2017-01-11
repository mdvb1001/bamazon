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
            console.log(result);
            console.log(result[0].stock_quantity);
            console.log(result[0].item_id);
            console.log(answer.quantityOfItem);
            if (answer.quantityOfItem <= result[0].stock_quantity) {
                var newQuantity = result[0].stock_quantity - answer.quantityOfItem;
                console.log(newQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuantity
                }, {
                    item_id: result[0].item_id
                }], function (err, res) {
                    console.log('Your purchase has been complete!');
                }).then(reset());
            } else {
                console.log('Insufficient Quantity!');
                reset();
            }
        });
    });
}
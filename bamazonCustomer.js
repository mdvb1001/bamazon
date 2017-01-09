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
    showItems().then(function () {
        return startPrompt();
    });
});

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

function startPrompt() {
    return (inquirer.prompt([{
        name: 'id-of-item',
        type: 'input',
        message: 'Enter ID of item to buy',
    }, {
        name: 'quantity-of-item',
        type: 'input',
        message: 'Enter quantity to buy'
    }]));
}
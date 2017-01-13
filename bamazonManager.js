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
    reset().catch(function (err) {
        console.log(err);
    });
});

function reset() {
    return inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Product for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit App'],
        name: 'menu'
    }]).then(function (answer) {
        if (answer.menu === 'View Product for Sale') {
            return viewProducts().then(function () {
                reset();
            });
        } else if (answer.menu === 'View Low Inventory') {
            return lowInventory();
        } else if (answer.menu === 'Add to Inventory') {
            return viewProducts().then(function () {
                return addInventory();
            });
        } else if (answer.menu === 'Add New Product') {
            return addNewProduct();
        } else if (answer.menu === 'Exit App') {
            return exitApp();
        }
    });
}

function addNewProduct() {
    return inquirer.prompt([{
        name: 'productName',
        type: 'input',
        message: 'Enter Name of New Product',
        validate: function (input) {
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
            if (isNaN(input) !== true) {
                return true;
            } else {
                console.log("\nError: please enter a number");
                return false;
            }
        }
    }]).then(function (answer) {
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
                console.log('New Item Added!');
                return reset();
            });
        });
    });
}

function addInventory() {
    return inquirer.prompt([{
        name: 'idOfItem',
        type: 'input',
        message: 'Enter ID of item to add inventory to it',
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
        message: 'Enter quantity to add to inventory',
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
            var newQuantity = parseInt(result[0].stock_quantity) + parseInt(answer.quantityOfItem);
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newQuantity
            }, {
                item_id: result[0].item_id
            }], function (err, res) {
                console.log('Inventory replenished!');
                reset();
            });
        }).catch(function (err) {
            console.log(err);
        });
    });
}

function viewProducts() {
    return new Promise(function (success, failure) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw (err);
            success(res);
            for (var i = 0; i < res.length; i++) {
                console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + 'Dept: ' + res[i].department_name + " | " + '$' + res[i].price + " | " + "Qty: " + res[i].stock_quantity);
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
                    console.log('ID#: ' + res[i].item_id + " | " + res[i].product_name + " | " + 'Dept: ' + res[i].department_name + " | " + '$' + res[i].price + " | " + "Qty: " + res[i].stock_quantity);
                }
            }
            return reset();
        });
    });
}

function exitApp () {
    connection.destroy();
}
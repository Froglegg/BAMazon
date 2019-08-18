var mysql = require("mysql");
var inquirer = require("inquirer");

let product;
let id;
let quantity;
let price;
let productArray = [];

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Duckbutter1",
    database: "bamazon_db"
});

console.log("\nConnecting to the Bamazon network...\n")

connection.connect(function(err) {
    if (err) throw err;
    console.log("\nConnected! Welcome to Bamazon!!\n");
    afterConnection();
});

function afterConnection() {
    // resets product array, we are only purchasing one product at a time with this program
    productArray = [];

    setTimeout(function() {
        readAllProducts();
    }, 500);

    setTimeout(function() {
        goShopping();
    }, 1000);

}


function readAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(`\nID | Name | Department | Price | Quantity`);
        res.forEach(element => {
            console.log(`\n${element.id} | ${element.product_name} | ${element.department_name} | ${element.price} | ${element.quantity}\n`)
        });
    });
}

function goShopping() {
    inquirer
        .prompt([{
            message: "What product would you like to buy? Enter item ID",
            name: "product",
        }])
        .then(answer => {
            connection.query('SELECT * FROM products WHERE ?', [
                { id: answer.product }
            ], function(err, res) {
                if (err) throw err;
                res.forEach(element => {
                    productArray.push(element);
                });
                product = productArray[0].product_name;
                quantity = parseInt(productArray[0].quantity);
                price = parseFloat(productArray[0].price);
                console.log(`\nYOU SELECTED ${product}\n`);


                inquirer.prompt([{
                    type: "confirm",
                    name: "correct_product",
                    message: `Are you sure you want to purchase ${product}?`
                }]).then(answer => {
                    if (answer.correct_product) {
                        inquirer.prompt([{
                            message: "How many would you like to buy?",
                            name: "amount",
                            validate: function(value) {
                                var valid = parseFloat(value) <= quantity;
                                return valid || `Only ${quantity} remaining!`;
                            }
                        }]).then(answer => {

                            console.log(`\n Purchasing ${answer.amount} of ${product} for $ ${price} each...`);
                            let amount = answer.amount;

                            connection.query(`UPDATE products SET quantity = quantity - ${amount} WHERE ?`, [
                                { product_name: product }
                            ]);
                            connection.query(`SELECT * FROM products WHERE ?`, [
                                { product_name: product }
                            ], function(err, res) {
                                if (err) throw err;
                                res.forEach(element => {
                                    console.log(`${element.quantity} remaining of ${element.product_name}`);
                                });
                            });

                            setTimeout(function() {
                                readAllProducts();
                            }, 1000);

                            setTimeout(function() {
                                continuePrompt();
                            }, 1500);



                        });

                    } else {
                        afterConnection();
                    }
                });



            });




        });
}

function continuePrompt() {
    inquirer.prompt([{
        name: "continue",
        type: "confirm",
        message: "Would you like to purchase another item?"
    }]).then(answer => {
        if (answer.continue) {
            afterConnection();
        } else {
            console.log("OK then, have a good day!");
            connection.end();
        }
    });
}
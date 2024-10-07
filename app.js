const prompt = require('prompt-sync')();

const username = prompt('What is your name? ');

console.log(`Your name is ${username}`);

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const Customer = require('./models/customer.js');

const welcomeMessage = () => {
    console.log(`Welcome to the CRM ${username}!`);
};

const displayMenu = () => {
    console.log("\nPlease choose an action:");
    console.log("1. Create Customer");
    console.log("2. View Customers");
    console.log("3. Update Customer");
    console.log("4. Delete Customer");
    console.log("5. Quit");
};

const createCustomer = async () => {
    const name = prompt('Enter customer name: ');
    const age = prompt('Enter customer age: ');

    const customer = new Customer({ name, age });
    await customer.save();
    console.log('Customer created successfully');
};

const viewCustomers = async () => {
    const customers = await Customer.find();

    if (customers.length === 0) {
        console.log('No customers found.');
        return;
    };

    console.log('\nList of Customers:');
    customers.forEach(customer => {
        console.log(`ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`);
    });
};

const updateCustomer = async () => {
    await viewCustomers();
    const id = prompt('Copy and paste the id of the customer you would like to update here: ');

    const customer = await Customer.findById(id);

    if (customer) {
        const newName = prompt('What is the customers new name? ');
        const newAge = prompt('What is the customers new age? ');

        if (newName) customer.name = newName;
        if (newAge) customer.age = newAge;

        await customer.save();
        console.log('Customer updated successfully!');
    } else {
        console.log('Customer not found.');
    };
};

const deleteCustomer = async () => {
    await viewCustomers();
    const id = prompt('Copy and paste the id of the customer you would like to delete here: ');
    
    const result = await Customer.findByIdAndDelete(id);

    if (result) {
        console.log('Customer deleted Successfully!');
    } else {
        console.log('Customer not found');
    };
};

const main = async () => {
    welcomeMessage();

    while (true) {
        displayMenu();
        const choice = parseInt(prompt('What would you like to do? '));

        switch (choice) {
            case 1:
                await createCustomer();
                break;
            case 2:
                await viewCustomers();
                break;
            case 3:
                await updateCustomer();
                break;
            case 4:
                await deleteCustomer();
                break;
            case 5:
                console.log('exiting...');
                await mongoose.disconnect();
                return;
            default:
                console.log('Invalid choice. Please enter one of the options listed. ');
        };
    };
};

main();
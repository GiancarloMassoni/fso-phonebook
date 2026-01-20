require("dotenv").config();
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}

// if (process.argv.length === 5) {
person.save().then((res) => {
  console.log(`added ${person.name} number ${person.number} to phonebook`);
  mongoose.connection.close();
});
// }

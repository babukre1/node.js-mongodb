import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const client = new MongoClient("mongodb://localhost:27017");

async function run() {
  try {
    await client.connect("mongodb://localhost:27017");
    console.log("Connected to MongoDB Succesfully");
    const db = client.db("university");
    const students = db.collection("students");

    try {
      // insert many
      const manystudents = await students.insertMany([
        {
          name: "fahad",
          age: 22,
          department: "Engineering",
          year: 4,
        },
        {
          name: "Mohamed",
          age: 17,
          department: "Engineering",
          year: 4,
        },
        {
          name: "Amina",
          age: 16,
          department: "Engineering",
          year: 4,
        },
      ]);

      console.log(`inserted ${manystudents.insertedCount} students`);
    } catch (error) {
      if (error.code === 11000) console.error("Duplicatd names exist");
    }
    // retrieve all
    const allStudents = await students.find().toArray();
    console.log(allStudents);

    // find one
    const oneStudent = await students.findOne({ name: "Isra" });
    console.log(oneStudent);

    // retreive all students with filter
    const medicineStudents = await students
      .find({ department: "Medicine" })
      .toArray();
    console.log(medicineStudents);

    // find specific fields names and ages
    const find_students_Name_And_Age = await students
      .find({}, { projection: { name: 1, age: 1, _id: 0 } })
      .toArray();
    console.log(find_students_Name_And_Age);

    // update one student
    const updatedStudent = await students.updateOne(
      { name: "Isra" },
      { $set: { age: 18 } }
    );
    console.log("Updated Students: ", updatedStudent.modifiedCount);

    // update many students
    const updateManyStudents = await students.updateMany(
      { age: 22 },
      { $set: { year: 4 } }
    );
    console.log("Updated Students: ", updateManyStudents.modifiedCount);

    // delete one
    const deletedStudent = await students.deleteOne({ name: "Hawa" });
    console.log(`deleted ${deletedStudent.deletedCount} students`);

    // delete many
    const deletedStudents = await students.deleteMany({ age: 16 });
    console.log(`deleted ${deletedStudents.deletedCount} students`);
  } catch (error) {
    console.error("Error Connecting to Database ", error);
  } finally {
    await client.close();
    console.log("Connecion closed");
  }
}

run();
const port = 3000;

app.get("/hello", (req, res) => {
  res.send(
    "Hello world, i just got into backend world through express and node.js"
  );
});

app.listen(port, () => {
  console.log(`App listening on Port ${port}`);
});

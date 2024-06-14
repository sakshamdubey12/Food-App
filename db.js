const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = "mongodb+srv://astharai572:astha123@merncluster.de2xyob.mongodb.net/gofoodmern?retryWrites=true&w=majority"

const connectToMongoDb = async () => {
        await mongoose.connect(mongoURI, { useNewUrlParser: true });
        console.log(`MongoDB connected`);
        const fetched_data = await mongoose.connection.db.collection("food_items");
        fetched_data.find({}).toArray(async function(err,data){
                const foodCategory = await mongoose.connection.db.collection('food_category');
                foodCategory.find({}).toArray(function(err,catData){
                        if(err) console.log(err);
                        else{
                                global.food_items = data;
                                global.foodCategory = catData;
                        }

                })
        }) 
        } 



module.exports = connectToMongoDb;


const mongoose = require("mongoose")

const connectDB  = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err);
        process.exit(1)
    }
}

module.exports = connectDB
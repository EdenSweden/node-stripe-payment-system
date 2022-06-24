//If not in production environment, load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

console.log(stripeSecretKey)

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
//sets all the files in 'public' folder as static, and those will be the front end
app.use(express.static('public'))

app.listen(3000)



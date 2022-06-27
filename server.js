//If not in production environment, load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
//sets all the files in 'public' folder as static, and those will be the front end
app.use(express.static('public'))
app.use(express.json())

app.get('/store', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if (error) {
            res.status(500).end()
        } else {
            //all pages rendered by this render method need to be stored in views folder.
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})

app.post('/purchase', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if (error) {
            res.status(500).end()
        } else {
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.forEach(item => {
                const itemJson = itemsArray.find(i => {
                    return i.id == item.id
                })
                total += (itemJson.price * item.quantity)
            })
            //charges.create() returns a promise:
            stripe.charges.create({
                //stripe expects the amount to be in pennies, not dollars (to avoid floating point rounding errors), so this format is correct:
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(() => {
                console.log('Charge Successful')
                res.json({
                    //message we can show the user so they know the charge went through:
                    message: 'Successfully purchased items.'
                })
            }).catch(()=>{
                console.log('Charge failed.')
                res.status(500).end()
            })
        }
    })
})

app.listen(3000)

console.log('Server is listening on port 3000.')




const stripe=require("stripe")(process.env.STRIPESK);
const { v4: uuid } = require('uuid');


exports.makepayment=(req,res)=>{
    const{products,token}=req.body;
    let total = 0;
    products.map(product=>{
        total= total+(product.price*product.count);
    });
    total=total*100;
    const idempotencyKey=uuid();

    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then(customer=>{
        stripe.charges.create({
            amount:total,
            currency:'inr',
            customer:customer.id,
            receipt_email:token.email,
            description:"test account",
            shipping:{
                name:token.card.name,
                address:{
                    line1:token.card.address_line1,
                    city:token.card.address_city,
                    country:token.card.address_country,
                    zipcode:token.card.address_zipcode
                }
            }
        },{idempotencyKey})
        .then(result=>{
            res.status(200).json(result)})
        .catch(err=>console.log(err));
    })
}
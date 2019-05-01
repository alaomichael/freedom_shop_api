var express = require('express');
var app = express();
var bodyParser = require ('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/freedom-shop')

var Product = require('./model/product');
var WishList = require ('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/product', function(request,response){
    var product = new Product();
    product.title = request.body.title;
    product.price  = request.body.price;
    product.save(function(err,saveProduct){
        if (err){
            response.status(500).send({error:"Could not save product"});
        } else {
            response.send(saveProduct);
        }
    });
});

app.get('/product', function(request,response){

    Product.find({},function(err,products){
        if (err){
            response.status(500).send({error:"Could not fetch products"});
        } else {
            response.send(products);
        }
    });
});

app.get('/wishlist', function(request,response) {
 WishList.find({}).populate({path:'products', model: 'Product'}).exec(function(err, wishLists)
 {
     if (err) {
         response.status(500).send({ error: "Could not fetch the wishlist" });
     } else {
         response.send(wishLists);
     }
 });
});

app.post('/wishlist', function(request, response){
   var wishList = new WishList();
   wishList.title = request.body.title;

   wishList.save(function(err,newWishList){
       if (err){
           response.status(500).send({error:"Could not create wish list"});
       } else{
           response.send(newWishList);

       }
   });
});


app.put('/wishlist/product/add', function(request,response){
Product.findOne({_id: request.body.productId}, function(err,product){
    if(err){
        response.status(500).send({error:"Could not add item to wishlist"});
    } else {
        WishList.update({_id:request.body.wishListId}, {$addToSet:
        {products: product._id}},
        function(err,wishList){
            if(err) {
                response.status(500).send({error:"Could not update wishlist"});
            } else{
                response.send(wishList);
            }
        });
    }
});
});

app.listen(3000, function(){
    console.log("Freedom Shop API running on port 3000...");

});
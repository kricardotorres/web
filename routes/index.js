
var express = require('express');
var router = express.Router();
var db= require('../models/conexion')
//bodyparser
var bodyParser = require('body-parser')
//uploader
var fileUpload = require('express-fileupload');
var uniqid = require('uniqid');
//instancia de uploader
router.use(fileUpload());
var ipn = require('paypal-ipn');
//call controller
var pagIndex= require("../controllers/inicio");
/* GET home page. */
router.get('/',pagIndex.index);
router.get('/books', function(req, res, next) {
  
  if (req.session.dato== null)
    res.redirect('/');//si no tiene session se va al directorio raiz
  
  res.render('books', { title: 'Libros', message:'' });//si si tiene corre esta linea
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', message:'s' });
});
router.get('/nosotros', function(req, res, next) {
  res.render('nosotros', { title: 'Nosotros' });
});
router.get('/productos', function(req, res, next) {

	/*var books=[ {id:1,title:"node js for net0", description:"NOde para todos uwu", price:"300.00", imagen:"https://i.ytimg.com/vi/tgWbijDPwC0/hqdefault.jpg" },
	{id:1,title:"node js for net1", description:"NOde para todos uwu", price:"300.00", imagen:"https://i.ytimg.com/vi/jzgLFnFNzI0/hqdefault.jpg" },
	{id:1,title:"node js for net2", description:"NOde para todos uwu", price:"300.00", imagen:"https://i.ytimg.com/vi/5sCgxr4UJGs/hqdefault.jpg" }
	]*/ 
	//sql uso
	db.query("SELECT *FROM libros", function(err,results){
    console.log(results);
		res.render('productos', { title: 'Productos', Libros:results });
	});


  
}); 
router.post('/books', function (req, res) {

	if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  var myFILENAME = uniqid()+req.body.userFilename+sampleFile.name; 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('public/images/'+myFILENAME, function(err) {
    if (err)
      return res.status(500).send(err);

   db.query("Insert into libros (titulo,descripcion,precio,imagen) VALUES ('"+req.body.titulo+"','"+req.body.descripcion+"','"+req.body.precio+"','/images/"+myFILENAME+"')", 
        function (err, result) {
            if (err) throw err;
            res.render('books', { title: 'Libros', message:'Se envio bien bby' });
        }
    );
  });  
});
router.post('/login', function (req, res) { 
 
    

   db.query("SELECT * FROM usuarios where usuario='"+req.body.user+"' and password='"+req.body.password+"';", 
        function (err, result) {
            if (result[0]== null) {
             req.session.dato=0; 
             return res.render('login', { title: 'Loguear', message:'No bby asi no' })
            }
            console.log(result[0].id_usuario);
            req.session.dato=1;  
            req.session.user_id=result[0].id_usuario;
            result=[]
            res.redirect('/books');
        }
    );
   
});
router.get('/view_cart', function(req, res, next) {

  var myproducts=[];
  req.session.mycart=[];
  req.session.cart.forEach(function(i, idx, array){
    db.query("SELECT * FROM libros where idLibros="+i, function(err,results){ 
    myproducts.push((results[0]));
     console.log(results[0]);
     console.log("sssssssssssssssssssss");
    console.log(results);
    console.log("sssssssssssssssssssss");
    console.log(myproducts); 
     console.log("next");
      
     if (idx === array.length - 1){ 
       req.session.mycart=myproducts;
       res.render('view_cart', { title: 'Productos', Libros:myproducts}); 
   }
    });
  }); 

  
  
}); 
router.get('/last_confirmation', function(req, res, next) {

 
        res.render('books', { title: 'Libros', message:'Compra realizada, esperando confirmación' });
 
  
  
}); 
router.post('/last_confirmation', function (req, res) { 
       var moment = require('moment');
 
    db.query("Insert into orders (products, totalPrice, created_at, user_id, isCompleted) VALUES ('"+req.session.cart+"','"+req.body.amount+"','"+new Date()+"','"+req.session.user_id+"','0')", 
function (err, result) {
    if (err) throw err;
    res.render('last_confirmation', { title: 'Ultima confirmación', message:'Confirma tu compra', total:req.body.amount });
 
      }
);
    
 
   
});
router.post('/add_cart', function (req, res) { 
       
          if (req.session.cart== null) {
            req.session.cart=[];
          } 
            req.session.cart.push(req.body.id); 
            console.log(req.session.cart)  ;
            res.redirect('/productos');
 
   
});
router.post('/delete_from_array', function (req, res) { 
       
          
          req.session.mycart.splice(parseInt(req.body.id), 1); 
          req.session.cart.splice(parseInt(req.body.id), 1); 
          return res.status(400).send(req.session.mycart);
   
});
router.post('/ordercomplete', function (req, res) {  

ipn.verify(params, {'allow_sandbox': true}, function callback(err, msg) {
  if (err) {
    console.error(err);
  } else {
    // Do stuff with original params here

    if (params.payment_status == 'Completed') {
            db.query("UPDATE `erpprueba`.`orders` SET `isCompleted`='1' WHERE `ID`='1'", 
function (err, result) {
    if (err) throw err;
   return res.status(400).send("READY");
 
      }
);
    }
  }
});
   
});

module.exports = router;

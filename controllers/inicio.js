 const RfcFacil = require("rfc-facil");
exports.index= function(req, res, next) {
	 

// persona moral con razon-social Sonora Industrial Azucarera, S. de R. L.
// y fecha de creacion del 20 de Noviembre de 1982
const rfc  = RfcFacil.forNaturalPerson({
 name: 'Ricardo Antonio',
   firstLastName: 'Medina',
   secondLastName: 'Torres',
   day: 30,
   month: 07,
   year: 1996
});
console.log(rfc);
  res.render('index', { title: 'Index', message:rfc });
}
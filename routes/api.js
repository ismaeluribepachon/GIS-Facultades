var express = require('express');
var router = express.Router();

var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost/postgis";


/* GET home page. */
router.get('/', function(req, res, next) {
  //devolver todo lo que se puede hacer
  console.log("En / de api");
});

router.get('/facultad', function(req, res, next){

	var id = req.param('id');
	var query;
	var respuesta = [];

	if(id != undefined){
		query = 'SELECT name, ST_X(ST_GeomFromText(ST_AsText(location))) AS x, ST_Y(ST_GeomFromText(ST_AsText(location))) AS y, description, image from "facultades" where id = '+id;
	}else{
		query = 'SELECT id, name, ST_X(ST_GeomFromText(ST_AsText(location))) AS x, ST_Y(ST_GeomFromText(ST_AsText(location))) AS y from "facultades"';
	}

	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query(query ,function (err, result){
			done();
			if(err){	
				return console.error('error running query', err);
			}
			for(var i = 0; i < result.rows.length; i++) {
				respuesta.push(result.rows[i]);
			}

			if(respuesta.length == 1){
				res.send(respuesta[0]);
			}else{
				if(respuesta.length == 0){
					res.send("-1")
				}else{
					res.send(respuesta);
				}
			}
			
		});
	});
	//Se mandan los ID, los nombres y los puntos del mapa de todas las facultades y se le devuelven los datos de la facultad deseada identificada por el ID si se le pasa como parametro o -1 si no existe
});

module.exports = router;
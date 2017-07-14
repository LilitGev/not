// POST /users       <- body
// GET /users/34
// DELETE /users/34
// UPDATE /users/34  <- body
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const store = {
	users: {},
	addItem : function (obj){
		this.users[obj._id] = obj;
	},
	getItem : function (id){
		return this.users[id];
	},
	removeItem : function(id){
		delete this.users[id];
	}
};
http.createServer(function(req, resp){
	const purl = url.parse(req.url);
	const uri = req.url.slice(1) ;
	if(uri === "users"){
		if(req.method === 'POST'){
			const id = Math.floor((Math.random()*1000) +1) /*+ new Date().toJSON()*/;
			var body = '';
			req.on('data', function(data){
			    body += data;
			    if (body.length > 1e6) {
			    	req.conection.destroy();
			    }
			});
			req.on('end', function(){
			    var data = JSON.parse(body);
			    data._id = id;
			    store.addItem(data);
			    console.log(store.users);
			    resp.end(JSON.stringify(store.getItem(id)));
			});
		return;
		};		
		if (req.method === 'PUT') {
			var body = '';
			req.on('data', function(data){
			    body += data;
			    if (body.length > 1e6) {
			    	req.conection.destroy();
			    }
			});
			req.on('end', function(){
			    var data = JSON.parse(body);
			    const myObj = store.getItem(data._id);
			    if(myObj){
			    	if (data.firstName === '') {
			    		data.firstName = myObj.firstName;
			    	};
			    	if (data.lastName === '') {
			    		data.lastName = myObj.lastName;
			    	}
			    	if (data.email === '') {
			    		data.email = myObj.email;
			    	}
			    	store.addItem(data);
			    	console.log(store.users);
				}
			});
		resp.end();
		return;
		};
		if (req.method === 'GET'){
			resp.end(JSON.stringify(store.users));
			return;
		}
	};
	if(purl.pathname.indexOf('/users') === 0 && purl.pathname.length > 7){
		if (req.method === 'GET') {
			const itemId = purl.pathname.slice(7);
			const result = store.getItem(itemId);
			console.log(result);
		    resp.end(JSON.stringify(result));
		    return;
		}
		if (req.method === 'DELETE') {
			const itemId = purl.pathname.slice(7);
			store.removeItem(itemId);
			console.log(store.users);
		}
	}
	fs.readFile('./not.html', function(err, data){
		if(err){
			resp.writeHead(404,{'Content-Type' : 'text/plain'});
			resp.write("Error 404: Page not found");
		} else{
			resp.write(data);
			resp.end();
		}
	})
}).listen(1000);
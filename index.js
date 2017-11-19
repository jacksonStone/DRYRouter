const { getController } = require('./trafficControl')
const { initial, attachBody } = require('formatrequest')
const { verify } = require('keykeeper')

var router = function(req, res) {

	if(!verify(req)) {
		res.writeHead(401);
		return res.end('Hmm, try again?');
	}

	const formattedReq = initial(req);
	const controller = getController(formattedReq);
	if(!controller) {
		res.writeHead(404); 
		return res.end('Invalid Route');
	}
	let handleBody;
	//We don't want to do default body data gathering
	if(controller.streamBody) {
		handleBody = controller.handler(formattedReq, req);
	} 
	else {
		//Want whole body at once
		handleBody = attachBody(req, formattedReq)
			.then(()=>{
				return controller.handler(formattedReq);
			})
	}

  return handleBody
  	.then(handlerRes => {

  		//If our handler needs to set headers
  		if(controller.headers) {
  			res.writeHead(200, handlerRes.headers);
  			res.write(handlerRes.body || "Ok");
  			return res.end();
  		}

			if(typeof handlerRes === 'object') {
				handlerRes = JSON.stringify(handlerRes);
			}
			res.writeHead(200);
			res.write(handlerRes ||  "Ok");
			res.end();
		})
		.catch(err => {
			res.writeHead(400);
			res.end(err.message);
		});
}


module.exports = router;


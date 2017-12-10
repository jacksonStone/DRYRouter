
// {
// 	'/js' : { type:'application/javascript', path:'client/javascript' }
// 	'/css' : { type:'text/css', path:'client/css' } ,
// 	'/page' : { type:'text/html', path:'client/pages' },
// 	'/favicon.ico' : { path: 'favicon.ico' }
// }
const glob = require("glob");
const appRoot = require('app-root-path').toString();

module.exports = function(map, staticContent) {
	for(const i in map) {
		const v = map[i];
		if(typeof v === 'string') {
			let content = require('fs').readFileSync('./' + v);
			staticContent[i] = {body:content};
			continue;
		}
		const path = v.path;
		const fullPath = appRoot + '/' + path;
		const files = glob.sync(fullPath + '/**');
		for(const i0 in files) {
			let filePath = files[i0].substring(fullPath.length);
			if(filePath) {
				let content = require('fs').readFileSync(files[i0]);
				let payload = staticContent[i+filePath] = {body:content};
				if(v.type) {
					payload.headers = {'Content-Type':v.type};
				}
			}
		}		
	}
}
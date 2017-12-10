
// {
// 	'/js' : { type:'application/javascript', path:'client/javascript' }
// 	'/css' : { type:'text/css', path:'client/css' } ,
// 	'/page' : { type:'text/html', path:'client/pages' },
// 	'/favicon.ico' : { path: 'favicon.ico' }
// }
const glob = require("glob");
const appRoot = require('app-root-path').toString();
console.log(appRoot);

module.exports = function(map, staticContent) {
	map.forEach((v, i) => {
		const path = v.path;
		const files = glob(appRoot + '/' + path + '/**');
		console.log(files);
	});
}
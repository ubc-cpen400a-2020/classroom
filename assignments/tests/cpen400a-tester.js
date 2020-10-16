// This module is INSECURE
const Module = require('module');
const http = require('http');
const path = require('path');

const exported = new Map();
let initialized = false;

module.exports = {
	connect: async (url) => {
		if (!initialized){
			let cpen400a = await new Promise((resolve, reject) => http.get(url, res => {
				let filename = 'cpen400a.js';
				let data = '';
				res.setEncoding('utf8');
				res.on('data', chunk => data += chunk);
				res.on('end', () => {
					let cpen400a = new Module('', module.parent);
					cpen400a.filename = filename;
					cpen400a.paths = Module._nodeModulePaths(path.dirname(filename));
					cpen400a._compile(data, filename);

					resolve(cpen400a.exports);
				});
			}));
			cpen400a.initialize({
				exported: exported
			});	
		}
		initialized = true;
	},
	export: (filename, dict) => {
		let scope = path.basename(filename);
		if (!exported.has(scope)) exported.set(scope, {});
		Object.assign(exported.get(scope), dict);
	}
}
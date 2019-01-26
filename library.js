'use strict';

const meta = module.parent.require('./meta');
const controllers = require('./lib/controllers');

const plugin = {};

plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	router.get('/admin/plugins/knowledge-base', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/knowledge-base', controllers.renderAdminPage);

	plugin.syncSettings(callback);
};

plugin.syncSettings = function (callback) {
	meta.settings.get('knowledge-base', function (err, settings) {
		if (err) {
			return callback(err);
		}

		plugin.settings = Object.assign((plugin.settings || {}), settings);
		callback();
	});
};

plugin.onSettingsChange = function (data) {
	if (data.plugin === 'knowledge-base') {
		plugin.settings = Object.assign((plugin.settings || {}), data.settings);
	}
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/knowledge-base',
		icon: 'fa-tint',
		name: 'Knowledge Base',
	});

	callback(null, header);
};

plugin.addPrivileges = function (data, callback) {
	const payload = this.hook.endsWith('human') ? { name: 'Knowledge Base' } : 'groups:knowledgeBase';
	data.push(payload);
	process.nextTick(callback, null, data);
};

module.exports = plugin;

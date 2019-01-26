'use strict';

const meta = require.main.require('./src/meta');
const privileges = require.main.require('./src/privileges').async;
const posts = require.main.require('./src/posts').async;
const topics = require.main.require('./src/topics').async;
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

plugin.allowEditing = async function (data, callback) {
	const kbEnabled = await privileges.posts.can('knowledgeBase', data.pid, data.uid);
	const tid = await posts.getPostField(data.pid, 'tid');
	const isMainPid = await topics.getTopicField(tid, 'mainPid') === data.pid;

	// If the user has the kb privilege, pretend they're OP to trick core into granting access
	data.owner = kbEnabled && isMainPid ? true : data.owner;
	callback(null, data);
};

module.exports = plugin;

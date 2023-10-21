'use strict';

const privileges = require.main.require('./src/privileges');
const posts = require.main.require('./src/posts');
const topics = require.main.require('./src/topics');

const plugin = module.exports;

plugin.init = function (params, callback) {
	callback();
};

plugin.addPrivilege = function (data, callback) {
	data.privileges.set(
		'knowledgeBase', { label: 'Knowledge Base' },
	);

	callback(null, data);
};

plugin.allowEditing = async function (data) {
	const kbEnabled = await privileges.posts.can('knowledgeBase', data.pid, data.uid);
	const tid = await posts.getPostField(data.pid, 'tid');
	const isMainPid = await topics.getTopicField(tid, 'mainPid') === data.pid;

	// If the user has the kb privilege, pretend they're OP to trick core into granting access
	data.owner = kbEnabled && isMainPid ? true : data.owner;
	return data;
};

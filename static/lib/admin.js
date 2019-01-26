'use strict';

/* globals $, app, socket, define */

define('admin/plugins/knowledge-base', ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('knowledge-base', $('.knowledge-base-settings'));

		$('#save').on('click', function () {
			Settings.save('knowledge-base', $('.knowledge-base-settings'), function () {
				app.alert({
					type: 'success',
					alert_id: 'knowledge-base-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					},
				});
			});
		});
	};

	return ACP;
});

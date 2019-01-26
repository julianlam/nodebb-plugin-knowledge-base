'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res/* , next */) {
	res.render('admin/plugins/knowledge-base', {});
};

module.exports = Controllers;

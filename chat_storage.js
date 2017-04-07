/*jslint node: true */
"use strict";
var db = require('./db.js');

function store(correspondent_address, message, is_incoming, type) {
	var type = type || 'text';
	db.query("INSERT INTO chat_messages ('correspondent_address', 'message', 'is_incoming', 'type') VALUES (?, ?, ?, ?)", [correspondent_address, message, is_incoming, type]);
}

function load(correspondent_address, up_to_id, limit, cb) {
	db.query("SELECT id, message, creation_date, is_incoming, type FROM chat_messages \n\
		WHERE correspondent_address=? AND id < "+up_to_id+" ORDER BY id DESC LIMIT ?", [correspondent_address, limit], function(rows){
			for (var i in rows) {
				rows[i] = parseMessage(rows[i]);
			}
			cb(rows);			
		});
}

function purge(correspondent_address) {
	db.query("DELETE FROM chat_messages \n\
		WHERE correspondent_address=?", [correspondent_address]);
}

function parseMessage(message) {
	switch (message.type) {
		case "system":
			message.message = JSON.parse(message.message);
			message.message = "chat recording " + (message.message.state ? "&nbsp;" : "") + "<b dropdown-toggle=\"#recording-drop\">" + (message.message.state ? "ON" : "OFF") + "</b><span class=\"padding\"></span>";
			break;
	}
	return message;
}

exports.store = store;
exports.load = load;
exports.purge = purge;
exports.parseMessage = parseMessage;
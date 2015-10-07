/**
@fileOverview

@toc

*/

'use strict';

angular.module('Angular Startup.ng-lumberjack', [])
.factory('asLumberJack', [ function () {



	var __jack ={
		config: {
			globalJack: true,
			save: {
				hardSave: false,
				all: false,
				error: true,
				warning: true,
				info: true,
				log: true,
				vanity: false
			},
			show: {
				all: true,
				vanity: true,
				error: true,
				warning: true,
				info: true,
				log: true
			}

		},
		storage: {
			lastAdded: null,
			data: [],
			add: function(obj){
				var save = __jack.config.save;
				var db = __jack.storage.data;
				var push = function(){
					db.push(obj);
				};
				if(save.all){
					push();
				}else {
					if(obj.gen == "error" && save.error){
						db.push(obj);
					}
					else if(obj.gen == "info" && save.info){
						db.push(obj);
					}
					else if(obj.gen == "warning" && save.warning){
						db.push(obj);
					}
					else if(obj.gen == "log" && save.log){
						db.push(obj);
					}
					else if(obj.gen == "vanity" && save.vanity){
						db.push(obj);
					}
				}

				if(save.hardSave){
					// @TODO: Save to local storage here
				}
			}
		},
		getMoment: function(){
			return {
				unix: moment().unix(),
				iso: moment().toISOString(),
				read: moment().format('MMMM Do YYYY, h:mm:ss a'),
				raw: moment()
			};
		},
		generateDataObject: function(obj){
			var ret = {
				data: obj.data || null,
				message: obj.msg || "",
				gen: obj.gen || "unknown"
			};

			ret.time = __jack.getMoment();

			return ret;
		},
		logger: {
			error: function(data){
				if(__jack.config.show.all || __jack.config.show.error){
					console.error(data.message, data.data);
				}
			},
			info: function(data){
				if(__jack.config.show.all || __jack.config.show.info){
					console.info(data.message, data.data);
				}
			},
			warning: function(data){
				if(__jack.config.show.all || __jack.config.show.warning){
					console.warn(data.message, data.data);
				}
			},
			bigWarning: function(data){
				if(__jack.config.show.all || __jack.config.show.vanity){
					console.log(data.message, data.data);
				}
			},
			log: function(data){
				if(__jack.config.show.all || __jack.config.show.log){
					console.log(data.message, data.data);
				}
			},
			title: function(data){
				if(__jack.config.show.all || __jack.config.show.vanity){
					console.log(data.message, data.data);
				}
			}
		}

	};

	var jack = {
		moment: __jack.getMoment,
		error: function(message, data){
			var dataObj = __jack.generateDataObject({
				msg: message,
				data: data,
				gen: "error"
			});
			__jack.storage.add(dataObj);
			__jack.logger.error(dataObj);
			return dataObj;
		},
		info: function(message, data){
			var dataObj = __jack.generateDataObject({
				msg: message,
				data: data,
				gen: "info"
			});
			__jack.storage.add(dataObj);
			__jack.logger.info(dataObj);
			return dataObj;
		},
		warning: function(message, data){
			var dataObj = __jack.generateDataObject({
				msg: message,
				data: data,
				gen: "warning"
			});
			__jack.storage.add(dataObj);
			__jack.logger.warning(dataObj);
			return dataObj;
		},
		store: {
			dump: function(){
				var dataObj = __jack.generateDataObject({
					msg: "lumberjack log dump: ",
					data: __jack.storage.data,
					gen: "log"
				});
				__jack.logger.log(dataObj);
			}
		}
	};


	var init = function(){
		__jack.storage.lastAdded = __jack.getMoment();
		if(__jack.config.globalJack){
				window.jack = jack;
		}
	};

	init();
	return jack;
}]);

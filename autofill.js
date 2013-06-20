/**
 Script for auto fill registration params from 3-rd party sites
*/
(function(Bingo, undefined) {
	Bingo.AutoFill = function(params) {
		if (params && params['formName']) {
			Config.formName = params['formName'];
		}

		var form  = document.forms[Config.formName];

		if (!form) {
			return;
		}

		var registry = new Registry() ;
		var connector = registry.getConnector();
		var dataProvider = registry.getDataProvider();
		connector.connect();

		form.onsubmit = function() {
			var data = dataProvider.getData();
			connector.sendData(data);

			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'origin';
			input.value = getOrigin();
			this.appendChild(input);

			return true;
		}
	}

	var getOrigin = function() {
		return window.location.origin || window.location.protocol + '//' + window.location.host;
	}

	var Registry = function() {
	}

	Registry.prototype = {
		getConnector : function() {
			return new IframeConnector() ;
		},

		getDataProvider : function() {
			return new FormDataProvider();
		}
	}

	var Config = {
		address : 'https://secure.bingosys.net/autofillapi.php',
		formName : 'regAutoFill',
		params : ['FirstName', 'LastName', 'Address1', 'City', 'State', 'Email', 'ReEmail', 'Postcode', 'PromoCode']
	}

	var Connector = function() {
	}

	Connector.prototype = {
		connetion : null,
		connect : function() {
			throw 'Method connect is abstract';
		},
		sendData : function() {
			throw 'Method sendData is abstract';
		}
	}

	var IframeConnector = function() {
	}

	IframeConnector.prototype = new Connector();

	IframeConnector.prototype.connect = function() {
		var iframe = document.getElementById('dataTransfer');

		if (iframe) {
			return true;
		}

		try {
			iframe = document.createElement('iframe');
			iframe.id = 'dataTransfer';
			iframe.frameBorder=0;
			iframe.width="1px";
			iframe.height="1px";
			iframe.src = Config.address;
			//iframe.onload = autofill.sendData;

			var body = document.getElementsByTagName('body')[0];
			body.appendChild(iframe);
			this.iframe = iframe;

		} catch (e) {
			return false;
		}

		return true;
	}

	IframeConnector.prototype.sendData = function(data) {
		if (!data) {
			return;
		}
		try {
			this.iframe.contentWindow.postMessage(data, Config.address);
		} catch(e) {
			console.log(e);
		}
	}


	var DataProvider = function() {
	}

	DataProvider.prototype = {
		getData : function() {
			throw 'Method getData is abstract';
		}
	}

	var FormDataProvider = function() {
	}

	FormDataProvider.prototype = new DataProvider() ;

	FormDataProvider.prototype.getData = function() {
		var form  = document.forms[Config.formName];
		var data = {};

		for (var i = Config.params.length - 1; i >= 0; i--) {

			var key = Config.params[i];
			var input = form[key];

			if (input && input.value) {
				data[key] = input.value;
			}
		};
		return JSON.stringify(data);
	}
}(window.Bingo = window.Bingo || {}));
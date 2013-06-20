

	var Redirector = function() {}

	Redirector.prototype = {
		params : [],
		setUrl : function(url) {
			this.url = url;
		},
		addParam : function(name, value) {
			this.params.push({'name' : name, 'value' : value});
		},
		redirect : function() {
			throw 'Method redirect is abstract';
		}
	}



	var GetRedirector = function() {}

	GetRedirector.prototype = new Redirector();

	GetRedirector.prototype.constructor = GetRedirector ;

	GetRedirector.prototype.redirect = function() {

		var link = document.createElement('a');

		for (var i = this.params.length - 1; i >= 0; i--) {
			link.href = this.url;
			var sep = (link.search === '') ? '?' : '&';
			this.url = link.href.replace(link.hash, '') + sep + this.params[i].name + '=' + this.params[i].value + link.hash;
		};

		window.location.href = this.url;
	};




	var PostRedirector = function() {}

	PostRedirector.prototype = new Redirector();

	PostRedirector.prototype.constructor = PostRedirector ;

	PostRedirector.prototype.redirect = function() {

		var body = document.getElementsByTagName('body')[0];
		var form = document.createElement('form');

		form.action = this.url;
		form.method = 'POST';
		form.name = 'redirectForm';

		for (var i = this.params.length - 1; i >= 0; i--) {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = this.params[i].name;
			input.value = this.params[i].value;
			form.appendChild(input);
		}

		body.appendChild(form);
		form.submit();

	};




	var RedirectFactory = function() {}

	RedirectFactory.prototype.getRedirector = function(requestMethod) {
		return requestMethod === 'POST' ? new PostRedirector() : new GetRedirector();
	}
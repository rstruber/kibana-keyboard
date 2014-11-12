(function() {
	var ext = {
		refreshToggle: null,
		currentInterval: null,
		refreshOn: function(interval) {
			if (interval == null)
			{
				element = document.querySelector("li.dropdown-submenu > ul > li:nth-child(2) > a");
			}
			else
			{
				element = document.querySelector("li.dropdown-submenu > ul > li:nth-child("+interval+") > a");
			}

			element.click();
			ext.refreshToggle = 1;
		},
		refreshOff: function() {
			document.querySelector("li.dropdown-submenu > ul > li > a").click();
			ext.refreshToggle = 0;
		},
		handleSpacebar: function(e) {
			ext.initState();

			// change the refresh interval
			if (ext.refreshToggle == 0) {
				ext.refreshOn(ext.currentInterval);
			}
			else {
				ext.refreshOff();
			}
		},
		// sets the refresh interval
		handleInteger: function(e) {
			ext.initState();
			var interval = e.keyCode-47;

			// 0 is keycode 48, but this should hit the 11th index
			if ( interval == 1 )
			{
				interval = 11;
			}

			ext.refreshOn(interval);
			ext.currentInterval = interval;
		},
		handleClick: function(e) {
			console.log(e);
		},
		// for things that do not depend on ui elements to be loaded
		init: function() {
			// only apply to top page
			if ( document != window.top.document ) return;

                        // handle space bar
			window.addEventListener('keydown', function(e) {
				var activeEl = document.activeElement;
				if ( activeEl && ((activeEl.tagName.toLowerCase() == 'input' || activeEl.type == 'text' || activeEl.tagName.toLowerCase() == 'textarea')) )
				{
					return;
				}

				if ( e.keyCode == 32 )
				{
					e.preventDefault();
					ext.handleSpacebar(e);
				}

				if ( e.keyCode >= 48 && e.keyCode <= 57 )
				{
					e.preventDefault();
					ext.handleInteger(e);
				}
			});
                },
		// kibana loads most of the ui through angular so can't use regular dom events to init off ui elements
		initState: function() {
			var refreshText = document.querySelector("li.dropdown > a > span.text-warning.ng-binding");

			if ( ext.refreshToggle == null )
			{
				if ( refreshText.style.cssText == "" ) {
					ext.refreshToggle = 1;
				}
				else {
					ext.refreshToggle = 0;
				}
			}

			// if there is a refresh interval already set...
			if ( ext.currentInterval == null && refreshText.style.cssText == "" )
			{
				var interval = refreshText.innerText;
				interval = interval.substring( interval.lastIndexOf(' ')+1 );

				switch (interval) {
					case "5s":
						ext.currentInterval = 2;
						break;
					case "10s":
						ext.currentInterval = 3;
						break;
					case "30s":
						ext.currentInterval = 4;
						break;
					case "1m":
						ext.currentInterval = 5;
						break;
					case "5m":
						ext.currentInterval = 6;
						break;
					case "15m":
						ext.currentInterval = 7;
						break;
					case "30m":
						ext.currentInterval = 8;
						break;
					case "1h":
						ext.currentInterval = 9;
						break;
					case "2h":
						ext.currentInterval = 10;
						break;
					case "1d":
						ext.currentInterval = 11;
						break;
				}
			}
		}
	};
	window._pause_kibana = ext;

	// wait till the opportune time to set up
	if ( document.readyState == 'complete' ) {
		ext.init();
	}
	else window.addEventListener('load', function() {
		ext.init();
	});
})();

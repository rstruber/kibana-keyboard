// Kibana Pause and Keyboard Controller
(function() {
	var kbkc = {
		initialized: false,

		refresh: {
			active: null,
			interval: null,

			toggle: function(i)
			{
				// If the given interval is blank and refresh is active - turn it off
				if (!i && kbkc.refresh.active)
				{
					kbkc.refresh.active = false;
					document.querySelector("kibana-simple-panel > div > form > ul > li.dropdown > ul > li.dropdown-submenu > ul > li:nth-child(1) > a").click();	
				}
				// If the given interval is blank and refresh is not active - reactivate at the last known interval
				else if (!i && !kbkc.refresh.active)
				{
					kbkc.refresh.active = true;
					document.querySelector("kibana-simple-panel > div > form > ul > li.dropdown > ul > li.dropdown-submenu > ul > li:nth-child("+kbkc.refresh.interval+") > a").click();	
				}
				// If given an interval set it to the given value
				else if (i)
				{
					var e = document.querySelector("kibana-simple-panel > div > form > ul > li.dropdown > ul > li.dropdown-submenu > ul > li:nth-child("+i+") > a");

					if (e)
					{
						kbkc.refresh.active = true;
						kbkc.refresh.interval = i;
						e.click();
					}
				}
			}
		},

		kiosk: {
			active: false,
			e: null, // Elements to hide/show for kiosk mode

			toggle: function() {
				if (kbkc.kiosk.active)
				{
					kbkc.kiosk.e.forEach(function(e) {
						e.style.display = 'block';
					});

					kbkc.kiosk.active = false;
				}
				else
				{
					kbkc.kiosk.e.forEach(function(e) {
						e.style.display = 'none';
					});

					kbkc.kiosk.active = true;
				}
			}
		},

		// toggles refresh on-off
		handleSpacebar: function(e) {
			kbkc.refresh.toggle();
		},

		// sets the refresh interval
		handleInteger: function(e) {
			var interval = e.keyCode-47;

			// 0 is keycode 48, but this should hit the 11th index
			if ( interval == 1 )
			{
				interval = 11;
			}

			kbkc.refresh.toggle(interval);
		},

		// puts kibana into a kiosk mode
		handleKioskMode: function(e) {
			kbkc.kiosk.toggle();
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

				kbkc.initState();

				// Handles the space bar
				if ( e.keyCode == 32 )
				{
					e.preventDefault();
					kbkc.handleSpacebar(e);
				}

				// Handles the 1-0 keys along top row of keyboard
				if ( e.keyCode >= 48 && e.keyCode <= 57 )
				{
					e.preventDefault();
					kbkc.handleInteger(e);
				}

				// Handle the "h" or "k" key
				if ( e.keyCode == 72 || e.keyCode == 75)
				{
					e.preventDefault();
					kbkc.handleKioskMode();
				}
			});
                },
		// kibana loads most of the ui through angular so can't use regular dom events to init off ui elements
		initState: function() {
			if (kbkc.initialized)
			{
				return;
			}

			var refreshText = document.querySelector("li.dropdown > a > span.text-warning.ng-binding");

			// if there is a refresh interval already set...
			if ( refreshText.style.display != 'none' )
			{
				// Gets the current setting from text in Kibana time interval
				var intervalCurrent = refreshText.innerText;
				intervalCurrent = intervalCurrent.substring( intervalCurrent.lastIndexOf(' ')+1 );
				// Gets the possbile settings - because this is dynamic
				var possibleIntervals = document.querySelectorAll("kibana-simple-panel > div > form > ul > li.dropdown > ul > li.dropdown-submenu > ul > li");
				possibleIntervals = Array.prototype.slice.call(possibleIntervals);

				possibleIntervals.forEach(function(e, i) {
					var intervalOption = e.firstChild.innerText;
					intervalOption = intervalOption.substring( intervalOption.lastIndexOf(' ')+1 );

					if (intervalOption == intervalCurrent)
					{
						kbkc.refresh.interval = i+1;
					}
				});

				kbkc.refresh.active = true;
			}
			else
			{
				// Set the default interval to the 2nd position of the dropdown's submenu
				kbkc.refresh.interval = 2;
				kbkc.refresh.active = false;
			}

			// querySelectorAll returns a NodeList which apparantly sucks so convert it to an array
			kbkc.kiosk.e = document.querySelectorAll("div.navbar-static-top, nil.ng-scope, div.kibana-row > div > div:nth-child(1) > div.row-open, .container-fluid.main.ng-scope > div > div > div.row-fluid > div > span, div.panel-extra-container > span.row-button.extra");
			kbkc.kiosk.e = Array.prototype.slice.call(kbkc.kiosk.e);

			kbkc.initialized = true;
		}
	};

	window._kibana_keyboard_control = kbkc;

	// wait till the opportune time to set up
	if ( document.readyState == 'complete' ) {
		kbkc.init();
	}
	else window.addEventListener('load', function() {
		kbkc.init();
	});
})();

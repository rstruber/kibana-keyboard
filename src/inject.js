(function() {
	var ext = {
		refreshToggle: 1,
		handleSpaceDown: function(e) {
			var activeEl = document.activeElement;

			if ( e.keyCode == 32 && (activeEl && (activeEl.tagName.toLowerCase() != 'input' && activeEl.type != 'text' && activeEl.tagName.toLowerCase() != 'textarea')) )
			{
				// disables the scrolling behavior
				e.preventDefault();

				// change the refresh interval
				if (ext.refreshToggle == 0) {
					nodes = document.querySelectorAll("li.dropdown-submenu > ul > li");
					nodes[1].childNodes[0].click();
					ext.refreshToggle = 1;
				}
				else {
					document.querySelector("li.dropdown-submenu > ul > li > a").click();
					ext.refreshToggle = 0;
				}
			}

		},
		init: function() {
                        // only apply to top page
                        if ( document != window.top.document ) return;

                        // handle command-g & esc
                        window.addEventListener('keydown', function(e) {
                                ext.handleSpaceDown(e);
                        });
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

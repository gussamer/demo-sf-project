function selectBreadcrumb_HS() {
	var rootPage = sessionStorage.getItem('rootPage') || 'home';

	var css = ''
	if(rootPage == 'settings') {
	css = '<style id="pseudo">.setting-crumb::before{display: none !important;} .home-crumb{display: none !important;}</style>';
	} else {
	css = '<style id="pseudo">.setting-crumb{display: none !important;}</style>';
	} 

	document.head.insertAdjacentHTML( 'beforeEnd', css );
}
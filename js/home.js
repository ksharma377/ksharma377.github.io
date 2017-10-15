$(document).ready(function() {
	setContainerWidth();
});

$(window).resize(function() {
	setContainerWidth();
});

function setContainerWidth() {
	$('#app-container').css('width', 'auto');
	var windowWidth = $(document).width();
	var blockWidth = $('.cool-link').outerWidth(true);
	var maxBoxPerRow = Math.floor(windowWidth / blockWidth);
	$('#app-container').width(maxBoxPerRow * blockWidth);
}

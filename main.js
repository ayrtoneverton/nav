Element.prototype.toggleClass = function(c) {
	return this.classList[this.classList.contains(c) ? 'remove' : 'add' ](c);
};
const $ = (s) => document.querySelector(s);
const iframe = $('iframe');

$('#hide').onclick = () => {
	document.body.toggleClass('hidden');
	iframe.focus();
	return false;
};

$('#logo').onclick = () => {
	iframe.src = 'home.html';
	iframe.focus();
	return false;
};

function clickHistoryc(e) {
	iframe.src = e;
	iframe.focus();
}

$('#historyc').onclick = function() {
	$('#historyc div').innerHTML =
		(localStorage.getItem('historyc') || '').split(';,;').map(e => e && `<div><a onclick="clickHistoryc('${e}')">${e}</a></div>`).join('');
	return false;
};

document.onsubmit = (e) => {
	e.preventDefault();
	const { form: { search: { value } } } = document;
	try {
		iframe.src = new URL(value);
		localStorage.setItem('historyc', `${localStorage.getItem('historyc') || ''}${iframe.src};,;`);
	} catch (_) {
		iframe.src = 'https://www.bing.com/search?q=' + encodeURIComponent(value);
	}
	iframe.focus();
}

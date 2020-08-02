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

const extractValues = (text) => {
	const values = text.split('=>');
	if (values.length < 2)
		values[1] = values[0];
	try {
		values[1] = new URL(values[1].trim());
	} catch (_) {
		values[1] = 'https://www.bing.com/search?q=' + encodeURIComponent(values[1]);
	}
	return values;
};

const checkEmpty = () => {
	const list = $('#history-list');
	let span = $('#history-list > span');
	if (list.children.length) {
		if (span && list.children.length > 1) span.remove();
		return;
	}
	span = document.createElement('span');
	span.innerHTML = 'Nada adicionado';
	list.prepend(span);
};

const enterHistory = ({ target: { href, text } }) => {
	document.form.search.value = text === href ? href : text + ' => ' + href;
	iframe.src = href;
	iframe.focus();
	$('#history').toggleClass('active');
	return false;
};

const removeHistory = ({ target: { parentElement: el } }) => {
	const list = localStorage.getItem('history').split(';,;').filter(e => e);
	const i = list.length - 1 - Array.from(el.parentElement.children).indexOf(el);
	list.splice(i, 1);
	list.push('');
	localStorage.setItem('history', list.join(';,;'));
	el.remove();
	checkEmpty();
	return false;
};

const addHistory = (text) => {
	if (!text) return;
	const div = document.createElement('div');

	let a = document.createElement('a');
	const [title, link] = extractValues(text);
	a.innerHTML = title;
	a.href = link;
	a.onclick = enterHistory;
	div.appendChild(a);

	a = document.createElement('a');
	a.innerHTML = 'X';
	a.href = '#remove-history';
	a.title = 'Remover';
	a.onclick = removeHistory;
	div.appendChild(a);

	$('#history-list').prepend(div);
};

(localStorage.getItem('history') || '').split(';,;').map(addHistory);
checkEmpty();

$('#add-history').onclick = () => {
	const { form: { search: { value } } } = document;
	localStorage.setItem('history', `${localStorage.getItem('history') || ''}${value};,;`);
	addHistory(value);
	checkEmpty();
	return false;
};

$('#history > .btn').onclick = (e) => {
	e.preventDefault();
	$('#history').toggleClass('active');
	return false;
};

document.onsubmit = (e) => {
	e.preventDefault();
	iframe.src = extractValues(document.form.search.value)[1];
	iframe.focus();
};

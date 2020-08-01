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
}

const enterHistory = (e) => {
	const { href, text } = e.target;
	document.form.search.value = text === href ? href : text + ' => ' + href;
	iframe.src = href;
	iframe.focus();
	$('#history').toggleClass('active');
	return false;
}

const removeHistory = (e) => {
	e.target.parentElement.remove();
	return false;
}

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

	list = $('#history-list');
	list.prepend(div);
}

(localStorage.getItem('history') || '').split(';,;').map(addHistory);

$('#add-history').onclick = () => {
	const { form: { search: { value } } } = document;
	localStorage.setItem('history', `${localStorage.getItem('history') || ''}${value};,;`);
	addHistory(value);
	return false;
};

$('#history > a').onclick = (e) => {
	e.preventDefault();
	$('#history').toggleClass('active');
	return false;
};

document.onsubmit = (e) => {
	e.preventDefault();
	iframe.src = extractValues(document.form.search.value)[1];
	iframe.focus();
}

const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// csrt (корзина)

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const longGoodsList = document.querySelector('.long-goods-list');
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');


const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибочка вышла: ' + result.status
	}
	return await result.json();
};

const cart = {
	cardGoods: [
		{
			id: "099",
			name: "Часы",
			price: 999,
			count: 2,
		},
		{
			id: "090",
			name: "Кеды",
			price: 9,
			count: 3,
		},
	],
	renderCard() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});
		
		const totaPrice = this.cardGoods.reduce((sum, item,) => {
			return sum + item.price * item.count;
		}, 0)
		cartTableTotal.textContent = totalPrice + '$'
	},
	deletGood(id) { },
	minusGood(id) { },
	plusGood(id) { },
	addCartGoods(id) {},
}

cart.renderCart()

const openModal = () => {
	modalCart.classList.add('show')
}

const closeModal = () => {
	modalCart.classList.remove('show')
}

buttonCart.addEventListener('click', openModal);


modalCart.addEventListener('click', function (event) {
	const target = event.target;
	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal()
	}
})


// scrol smooth (плавный скрол)

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		})
	}
}

// goods

const creatCard = function ({ label, name, img, description, id, price }) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	
	card.innerHTML = `
		<div class="goods-card">
			${label ? `<span class="label">${label} </span>` :
				''}
			<img src="db/${img}" alt="${name}" class="goods-image">
			<h3 class="goods-title">${name}</h3>
			<p class="goods-description">${description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>
		</div>
	`;
	
	return card;
};

const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	longGoodsList.append(...cards)
	document.body.classList.add('show-goods')
};

const showAll = function (event) {
	event.preventDefault();
	getGoods().then(renderCards);
};

viewAll.forEach(function (elem) {
	elem.addEventListener('click', showAll);
});

const filterCards = function (field, value) {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
};

navigationLink.forEach(function (link) {
	link.addEventListener('click', event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
});

showAcsessories.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Accessories');
	});
});
showClothing.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Clothing');
	});
});
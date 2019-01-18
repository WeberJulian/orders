const params = {
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
};

const prodURI = "https://nakiwi-test.glitch.me"
const devURI = "https://nakiwi-test2.glitch.me"

var URI = prodURI

export default {
	
	getProducts: async (delivery, update) => {
		var body = {
			id: delivery.products
		};
		var res = await fetch(URI + '/getProductList', {
			...params,
			body: JSON.stringify(body)
		});
		var result = await res.json();
		update(result.products);
	},
	getDeliveries: async (update) => {
		//not finished
		var res = await fetch(URI + '/getDeliveries', {
			...params,
			method: 'GET'
		});
		var result = await res.json();
		update(result.deliveries);
	},
	getCards: async (user, updateStatus, updateCards) => {
		var body = {
			email: user.email,
			token: user.token
		};
		var res = await fetch(URI + '/getCards', {
			...params,
			body: JSON.stringify(body)
		});
		var status = await res.json();
		updateStatus(status.status);
		if (status.status === 'OK') {
			updateCards(status.cards);
		}
	},
	getOrders: async (date, updateStatus, updateOrders) => {
        var route = '/listOrdersForDelivery'
        if(date){
            route += "/?date=14+january"
        }
		var res = await fetch(URI + route, {
			...params,
			method: 'GET'
		});
		var status = await res.json();
		updateStatus(status.status);
		if (status.status === 'OK') {
			updateOrders(status.orders);
		}
	},
	wake: async () => {
		var res = await fetch(URI + '/wakeup', {
			...params,
			method: 'GET'
		});
		var status = await res.json();
		if(status){
			if(status.uri){
				URI = status.uri
			}
		}
	}
	
};

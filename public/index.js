'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
const rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'distance': 1000,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];

// Step 1 :
rentals.forEach(x => {
  const car=cars.find(c => c.id==x.carId);
  const distance_comp=x.distance*car.pricePerKm;
  const number_of_day = (new Date(x.returnDate) - new Date(x.pickupDate)) / 86400000 + 1;
  const time_comp=number_of_day*car.pricePerDay;
  x.price = time_comp+distance_comp;

  // Step 2 :

  if(number_of_day > 10){
    x.price -= x.price*0.5;
  }
  else if (number_of_day > 4){
    x.price -= x.price*0.3;
  }
  else if (number_of_day > 1){
    x.price -= x.price * 0.1;
  }

  // Step 3 :

  const commission = (x.price * 0.3).toFixed(2);
  x.commission.insurance = commission / 2;
  x.commission.treasury = number_of_day;
  x.commission.virtuo = commission - x.commission.insurance - x.commission.treasury;

  // Step 4 :

  if(x.options.deductibleReduction){
    x.price += 4*number_of_day;
    x.commission.virtuo += 4*number_of_day;
  }

  // Step 5 :
  
  const actor = actors.find(act => act.rentalId == x.id);
  var actor_payment = actor.payment.find(p => p.who == "driver");
  actor_payment.amount = x.price;
  actor_payment = actor.payment.find(p => p.who == "partner");
  actor_payment.amount = x.price - commission;
  actor_payment = actor.payment.find(p => p.who == "insurance");
  actor_payment.amount = x.commission.insurance;
  actor_payment = actor.payment.find(p => p.who == "treasury");
  actor_payment.amount = x.commission.treasury;
  actor_payment = actor.payment.find(p => p.who == "virtuo");
  actor_payment.amount = x.commission.virtuo;
});

console.log(cars);
console.log(rentals);
console.log(actors);


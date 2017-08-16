/**
 * Created by Harshit Gupta on 09-08-2017.
 */
var Product = require('../models/product');
var mongoose= require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
    new Product({
    imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Gothic Video Game',
    description: 'Awesome Game!!!',
    price: 10
    }),
    new Product({
        imagePath: 'http://i.ebayimg.com/00/z/wsAAAOxyTkJSQFvK/$T2eC16VHJIgFHR3nWFG2BSQFvJkR!Q~~_32.JPG',
        title: 'Call of Duty Video Game',
        description: 'Gun Fights!',
        price: 20
    }),
    new Product({
        imagePath: 'https://vignette1.wikia.nocookie.net/starwars/images/f/f1/Jedi_Academy_PC.png/revision/latest?cb=20131120201410',
        title: 'Star Wars Video Game',
        description: 'Jedi!!Galactic War!!',
        price: 30
    }),
    new Product({
        imagePath: 'https://vignette4.wikia.nocookie.net/ageofempires/images/5/59/Aoeiiitherwarchiefs1.jpg/revision/latest/scale-to-width-down/250?cb=20071116010957',
        title: 'Age of Empires 3',
        description: 'Strategic Game',
        price: 15
    }),
    new Product({
        imagePath: 'https://i.ytimg.com/vi/v86GDADq3bg/maxresdefault.jpg',
        title: 'Fifa 15',
        description: 'Best Football Game!!',
        price: 30
    }),
    new Product({
        imagePath: 'http://s.pacn.ws/1500/n3/dark-souls-iii-415919.7.jpg?o4h2dg',
        title: 'Dark Souls 3',
        description: 'Another Awesome Game!!',
        price: 20
    })
    ];
var done=0;
for(var i=0;i<products.length;i++)
{
    products[i].save(function (err,result) {
        done++;
    if(done === products.length) {
        exit();
    }
    });
}
function exit() {
    mongoose.disconnect();
}

const handlebars = require('handlebars');
module.exports = () => {
    // Register the custom Handlebars helper for subtraction
    handlebars.registerHelper('subtract', function (num1, num2) {
        return num1 - num2;
    });

    handlebars.registerHelper('firstLetter', function (str) {
        return str[0];
    });

    // Register the custom Handlebars helper for addititon
    handlebars.registerHelper('add', function (num1, num2) {
        return parseInt(num1) + parseInt(num2);
    });

    handlebars.registerHelper('devide', function (num1, num2) {
        return num1 / num2;
    });

    handlebars.registerHelper('toDate', function (date) {
        date = new Date(date)
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const day = date.getDate();
        return `${year}-${month}-${day}`
    });

    handlebars.registerHelper('isEqual', function (str1, str2, options) {
        if (str1 == str2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    })

    handlebars.registerHelper('lessThanEquals', function (arg1, arg2, options) {
        if (arg1 <= arg2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    })

    handlebars.registerHelper('isWishlist', function (key, array, options) {
        for (let arr of array) {
            if (key.toString() === arr.product_id.toString()) {
                return options.fn(this);
            }
        }
        return options.inverse(this);
    })
}
module.exports = {
      welcome: '<h1><center>Рады вас приветствовать в интернет магазине "Tooday"</center></h1>',
      firstOrder: function (order) {
            return '<h1><center>Вы оформили заказ на сумму' + order.price + '</center></h1>' +
                    '<p>Ваш номер заказа' + order.order_num + '</p>'
      }
};
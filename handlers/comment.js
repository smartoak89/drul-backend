//
//
// exports.add = function (req, res, next) {
//     isValid(req.body, function (err, body) {
//         if (err) return res.status(400).json(error(400, err));
//         body.productId = req.params.id;
//         commentAPI.add(body, function (err, product) {
//             if (err) return next(err);
//             res.json(product);
//         })
//     });
// };
//
// function isValid (body, callback) {
//     var v = require('../libs/validator');
//
//     var data = {
//         reting: body.reting,
//         text: body.text
//     };
//
//     var schema = v.joi.object().keys({
//         retirg: v.joi.string().max(4).required(),
//         text: v.joi.string().max(500).required()
//     });
//
//     v.validate(data, schema, callback);
// }
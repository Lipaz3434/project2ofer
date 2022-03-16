const mongoose = require("mongoose");
const Joi = require("joi");


let toySchema = new mongoose.Schema({
  name:String,
  info:String,
  category:String,
  img_url:String,
  price:Number,
  date_created:{
    type:Date, default:Date.now()
  },
  user_id:String
})

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validateToy = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    category:Joi.string().min(2).max(50).required(),
    price:Joi.number().min(1).max(99999).required(),
    info:Joi.string().min(2).max(500).allow(null,""),
    img_url:Joi.string().min(3).max(500).allow(null,"")
  })
  return joiSchema.validate(_reqBody)
}
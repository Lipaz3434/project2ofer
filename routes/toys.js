const express= require("express");
const { auth } = require("../middlewares/atuh");
const { validateToy, ToyModel } = require("../models/toyModel");
const router = express.Router();


router.get("/", async(req,res) => {
  try{
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let data = await ToyModel.find({})
    .limit(perPage)
    .skip((page-1)*perPage)
    res.json(data);

  }
  catch(err){
    console.log(err);
    res.status(500).json({msg_err:"There problem in server try again later"})
  }
})

router.get("/category/:cat", async(req,res) => {
  try{
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let category = new RegExp(req.params.category,"i");
    let data = await ToyModel.find({category})
    .limit(perPage)
    .skip((page-1)*perPage)
    res.json(data);

  }
  catch(err){
    console.log(err);
    res.status(500).json({msg_err:"There problem in server try again later"})
  }
})

router.get("/search", async(req,res) => {
  try{
    let searchQ = req.query.s;

    let searchReg = new RegExp(searchQ,"i")
    let data = await ToyModel.find({$or:[{name:searchReg},{info:searchReg}]})
    .limit(20)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg_err:"There problem in server try again later"})
  }
})

// מביא רשימת עוגות של אותו משתמש בלבד לפי הטוקן
router.get("/userToys", auth ,async(req,res) => {
  try{
    let perPage = req.query.perPage || 4;
    let page = req.query.page || 1;
    let data = await ToyModel.find({user_id:req.tokenData._id})
    .limit(perPage)
    .skip((page-1)*perPage)
    // 1 -> asc - a -> z
    // -1 -> desc - z -> a
    .sort({_id:-1})
    res.json(data);

  }
  catch(err){
    console.log(err);
    res.status(500).json({msg_err:"There problem in server try again later"})
  }
})



router.post("/", auth, async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy)

  }
  catch(err){
    console.log(err);
  }
})

// עריכת רשומה קיימת
router.put("/:idToy", auth, async(req,res) => {
  // בודק אם המידע שנשלח מצד לקוח תקין
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let idToy = req.params.idToy;
    let data = await ToyModel.updateOne({_id:idToy, user_id:req.tokenData._id}, req.body);
    
    // modfiedCount:1 - אם יש הצלחה
    res.json(data)
  }
  catch(err){
    console.log(err);
  }
})

router.delete("/:idDel",auth,async(req,res) => {
  try{
    let idDel = req.params.idDel;
    let data = await ToyModel.deleteOne({_id:idDel, user_id:req.tokenData._id});
    // countDelted: 1 אם הצליח למחוק
    res.json(data);
  }
  catch(err){
    console.log(err);
  }
})



  
router.get('/prices', async(req,res) => {
  try{
    let max = req.query.max || 9999;
    let min = req.query.min || 0;
    let data = await ToyModel.find({price:{$gt:min,$lt:max}})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg_err:"There problem in server try again later"})
  }
})





module.exports = router;
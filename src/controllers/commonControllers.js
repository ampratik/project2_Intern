const interModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const mongoose = require('mongoose');


const createCollege = async function (req, res) {
    try {
      let Body = req.body 
      let arr = Object.keys(Body)
      let logo =req.body.logoLink;
      let Name =req.body.name;
      let FullName =req.body.fullName;
    
      let name = /^[a-zA-Z ]{2,45}$/.test(Name);

      let colleges = await collegeModel.findOne({ name : Name });

      if (arr.length==0) {
        res.status(400).send({ status: false , msg: "Invalid request. Please provide Details" })
      }
      else if (!Name || !FullName || !logo) {
        res.status(400).send({ status: false , msg: "Input field missing" })
      }
      else if (name == false) {
        res.status(400).send({ status: false , msg: "Please Enter valid name." });
      }
      else if (colleges) {
        res.status(400).send({ status: false , msg: "This College already exist" })
      }
      else if (!colleges) {
        let dataCreated = await collegeModel.create(Body);
        res.status(200).send({  status: true ,data: dataCreated });
      }
    } catch (err) {
      res.status(500).send({  status: false , msg: "Server not responding", error: err.message });
    }
  }

  

const createIntern = async function(req, res){
  try{
    let data = req.body
    let arr = Object.keys(data)
    let Name = /^[a-zA-Z ]{2,45}$/.test(req.body.name);
    let Email = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email)
    let Mobile = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(req.body.mobile) 
    let intern = await interModel.findOne({ email : req.body.email});
    let mobileNo = await interModel.findOne({ mobile : req.body.mobile});

    if (arr.length == 0) return res.status(400).send({ status: false, msg: "Invalid request. Please provide Details" })
    else if (!req.body.name || !req.body.email || !req.body.mobile || !req.body.collegeId) return res.status(400).send({  status: false ,msg: "Input field missing" })
    else if(!data.name)  return res.status(400).send({status: false, msg: "name is required"})
    else if (Name == false) return res.status(400).send({status:false , msg: "Please Enter valid name." })
    else if(!data.email)  return res.status(400).send({status: false, msg: "email is required"})
    else if (Email == false) return res.status(400).send({status:false , msg: "Please Enter valid email." })
    else if(intern)  return res.status(400).send({status: false, msg: "email already exist!"})
    else if(!data.mobile)  return res.status(400).send({status: false, msg: "mobile number is required"})
    else if (Mobile == false) return res.status(400).send({status:false , msg: "Please Enter valid mobile number." })
    else if(mobileNo)  return res.status(400).send({status: false, msg: "mobile number already exist!"})
    else if(!data.collegeId)  return res.status(400).send({status: false, msg: "collegeId is required"})
    else if (mongoose.Types.ObjectId.isValid(data.collegeId) == false) return res.status(400).send({ staus: false, msg: "College Id is Invalid" })

    let Id = await collegeModel.findOne({ _id: data.collegeId ,isDeleted:false});

    if(!Id){res.status(400).send({ status: false, Error: "College does not exist!" });}
    else{
        let internCreated = await interModel.create(data);
        res.status(201).send({ status: true, data: internCreated});
    }
}catch (err) {
  res.status(500).send({  status: false , msg: "Server not responding", error: err.message });
}
}



const collegeDetails =async function(req ,res){
  try{
      const info = req.query.collegeName
      if(Object.keys(info).length === 0) return res.status(400).send({status:false , message:"please Enter College Name"})
      const college = await collegeModel.findOne({name: info ,isDeleted:false})
      if(!college) return res.status(400).send({status:false , message:"did not found college with this name please register first"})
      const { name, fullName, logoLink } = college
        const data = { name, fullName, logoLink };
        data["interests"] = [];
        const collegeIdFromcollege = college._id;

        const internList = await interModel.find({ collegeId: collegeIdFromcollege  ,isDeleted:false});
        if (!internList) return res.status(404).send({ status: false, message: `${info} We Did not Have Any Intern With This College` });
        data["interests"] = [...internList]
        res.status(200).send({ status: true, data: data });


  }
  catch(error){
    console.log({message:error.message})
    res.status(500).send({status:false , message:error.Message})
  }
}


module.exports.createIntern = createIntern;

module.exports.createCollege = createCollege;

module.exports.collegeDetails =collegeDetails ;

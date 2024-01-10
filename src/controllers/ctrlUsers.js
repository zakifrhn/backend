const ctrl = {};
const model = require("../models/modelUsers");
const respone = require("../utils/respon");
const hash = require("../utils/hash");
const sendMail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const upload = require("../utils/upload");

ctrl.fetchData = async (req, res) => {
  try {
    const result = await model.getByUser(req.user);
    console.log(result);
    return respone(res, 200, result);
  } catch (error) {
    console.log(error);
    return respone(res, 500, error.message);
  }
};

ctrl.save = async (req, res) => {
  const pass = req.body.pass;
  if (pass.length < 8) {
    return respone(res, 400, "maaf, password kurang dari 8");
  }

  try {
    const hasPassword = await hash(req.body.pass);
    const email = req.body.email;
    const roles = req.body.roles || "user";
    const activationCode = jwt.sign(email, process.env.KEY);
    sendMail(email, activationCode, "activate");

    const params = {
      ...req.body,
      fullname: `${req.body.firstname} ${req.body.lastname}`,
      pass: hasPassword,
      roles: roles,
    };
    if (roles == undefined) {
      return roles;
    }
    const result = await model.saveData(params);
    return respone(res, 200, result);
  } catch (error) {
    console.log(error);
    return respone(res, 500, error.message, "username sudah terdaftar");
  }
};

ctrl.update = async (req, res) => {
  try {
    const id = await model.getByUser(req.user);
    const id_update = id[0].id_user;
    //console.log(id_update)

    //const id_send = id_req(id_update)
    const params = {
      ...req.body,
      fullname: `${req.body.firstname} ${req.body.lastname}`,
      id_user: id_update,
    };
    console.log(params);
    const result = await model.updateData(params);
    return respone(res, 200, result);
  } catch (error) {
    console.log(error);
    return respone(res, 500, error.message);
  }
};

ctrl.updateImgUser = async (req, res) => {
  try {
    const id = await model.getByUser(req.user);
    const id_update = id[0].id_user;

    if (req.file !== undefined) {
      req.body.image_user = await upload(req.file.path);
    }
    const { image_user } = req.body;
    console.log(image_user);
    const result = await model.updateImg({ image_user, id_update });
    return respone(res, 200, result);
  } catch (error) {
    console.log(error);
  }
};

ctrl.updatePass = async (req, res) => {
  try {
    const id = await model.getByUser(req.user);
    const id_update = id[0].id_user;

    const coba = req.body.pass;

    if (coba.length < 8) {
      return respone(res, 400, "maaf, password kurang dari 8");
    }

    const hasPassword = await hash(coba);
    const params = {
      pass: hasPassword,
      id_user: id_update,
    };

    const result = await model.updatePassword(params);
    return respone(res, 200, result);
  } catch (error) {
    console.log(error);
    return respone(res, 500, error.message);
  }
};

ctrl.delete = async (req, res) => {
  try {
    const idUser = req.params.id;
    const result = await model.deleteData(idUser);
    return respone(res, 200, result);
  } catch (error) {
    console.log(error);
    return respone(res, 500, error.message);
  }
};

module.exports = ctrl;

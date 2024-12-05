const Admin = require("../Models/Admins");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.adminLogin = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const validation = await validateUserInput(username, password);
  if (validation) {
    return res.status(202).json({
      status: 202,
      message: "username and password should not be empty",
    });
  }

  const findAdmin = await Admin.findOne({ username: username });
  if (findAdmin) {
    const comparePassword = await bcrypt.compare(password, findAdmin.password);
    if (!comparePassword) {
      return res.status(201).json({
        status: 201,
        message: "username/password is incorrect!!!",
      });
    }

    const token = await generateToken(findAdmin._id);

    return res.status(200).json({
      status: 200,
      message: "login successfull",
      data: {
        token: token,
        username: username,
        id: findAdmin._id,
        level: findAdmin.level,
      },
    });
  } else {
    return res.status(202).json({
      status: 202,
      message: "user not found",
    });
  }
};

exports.adminSignUp = async (req, res) => {
  try {
    let { username, level, password } = req.body;
    const admin = await Admin.findOne({ username: username });
    

    if (!admin) {
      level = parseInt(level.value);
      await bcrypt.hash(password, 10);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = {
        username,
        level,
        password: hashedPassword,
      };
      const AdminDb = await Admin.create(newAdmin);
      console.log(AdminDb);
      res
        .status(201)
        .json({ AdminDb: AdminDb, message: "Admin created successfully" });
    } else {
      res.status(200).json({ msg: "this user name is allredy existed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getAllAdmin = async (req, res) => {
  try {
    const allAdmin = await Admin.find({});
    console.log('allAdmin_____________: ', allAdmin);
    res
      .status(200)
      .json({ allAdmin: allAdmin, message: "Admin fecthed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    console.log(req.body);
    const { _id } = req.body;
    await Admin.deleteOne({ _id: _id });
    res
      .status(200)
      .json({ allAdmin: allAdmin, message: " deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.UpdateAdmin = async (req, res) => {
  try {
    console.log(req.body);
    const { _id, username, password, level } = req.body;
    const updateObj = {
      username: username,
      password: password,
      level: level,
    };
    await Admin.findOneAndUpdate({ _id: _id }, { $set: updateObj });
    if (updatedAdmin) {
      res
        .status(200)
        .json({ message: " Updateed successfully" });
    } else {
      res.status(301).json({ msg: "Updated Filed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateToken = async (admin_id) => {
  const token = await jwt.sign({ admin_id: admin_id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  return token;
};

const validateUserInput = async (username, password) => {
  if (
    username == null ||
    password == null ||
    username == "" ||
    password == "" ||
    username == undefined ||
    password == undefined
  ) {
    return true;
  } else {
    return false;
  }
};

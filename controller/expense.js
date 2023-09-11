const express = require("express");

const db = require("../util/expense");
const bcrypt = require("bcrypt");
const Expense = require("../models/expense");
const jwt = require("jsonwebtoken");
exports.createExpenseController = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    if (
      amount === undefined ||
      description === undefined ||
      category === undefined
    ) {
      console.log(amount, description, category);
      return res.status(400).json({ error: "Fill all fields" });
    } else {
      const ExpenseData = await Expense.create({
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
      });

      res.status(201).json({ expense: ExpenseData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

exports.getExpenseController = async (req, res) => {
  try {
    const data = await Expense.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ expense: data });
  } catch (err) {
    console.log("something went wrong", err);
  }
};
exports.deleteExpense = async (req, res) => {
  const uId = req.params.id;
  try {
    if (uId === undefined) {
      console.log("id is missing");
      res.status(400).json({ error: "ID is missing" });
      return;
    }
    await Expense.destroy({ where: { id: uId, userId: req.user.id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

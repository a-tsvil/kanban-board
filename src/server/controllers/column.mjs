import express from "express";
import { PrismaClient } from "@prisma/client";

/** @type {express.Router} */
const column = new express.Router();

const prisma = new PrismaClient();

column.get("/", async (_, res, next) => {
  const columns = await prisma.column.findMany({
    orderBy: [{ default: 'desc' }, { id: 'asc' }],
  });
  res.status(200).json(columns);

  next();
});

column.get("/:columnId", async (req, res, next) => {
  const column = await prisma.column.findUnique({
    where: { id: Number(req.params.columnId) },
    include: { cards: { orderBy: { ordering: 'asc' } } },
  });
  res.status(200).json(column);

  next();
});

column.post("/", async (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "title is missing" });
  }

  try {
    const count = await prisma.column.count({ where: { default: true } });
    await prisma.column.create({
      data: { title: req.body.title, default: count === 0 },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Oops, something witn wrong!" });
  }

  res.status(201).json({ message: "Created" });
  next();
});

column.put("/:columnId", async (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "title is missing" });
  }

  try {
    await prisma.column.update({
      where: { id: Number(req.params.columnId) },
      data: { title: req.body.title },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Oops, something witn wrong!" });
  }

  res.status(200).json({ message: "Updated" });
  next();
});

column.delete("/:columnId", async (req, res, next) => {
  try {
    const cards = await prisma.card.count({
      where: { columnId: Number(req.params.columnId) },
    });
    if (cards > 0) {
      return res.status(400).json({ message: "column must be empty" });
    }
    await prisma.column.delete({
      where: { id: Number(req.params.columnId) },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Oops, something witn wrong!" });
  }

  res.status(200).json({ message: "Deleted" });
  next();
});

export default column;

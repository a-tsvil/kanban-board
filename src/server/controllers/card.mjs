import express from "express";
import { PrismaClient } from "@prisma/client";

/** @type {express.Router} */
const card = new express.Router();

const prisma = new PrismaClient();

card.get("/", async (_, res, next) => {
  const cards = await prisma.card.findMany({
    include: { column: true },
  });
  res.status(200).json(cards);

  next();
});

card.get("/:cardId", async (req, res, next) => {
  const card = await prisma.card.findUnique({
    where: { id: Number(req.params.cardId) },
    include: { column: true },
  });
  res.status(200).json(card);

  next();
});

card.post("/", async (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "title is missing" });
  }

  try {
    const defaultColumn = await prisma.column.findFirst({
      where: { default: true },
    });
    if (!defaultColumn) {
      return res.status(500).json({ message: "default column is missing" });
    }
    await prisma.card.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        progress: Number(req.body.progress) || 0,
        columnId: defaultColumn.id,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Oops, something witn wrong!" });
  }

  res.status(201).json({ message: "Created" });
  next();
});

card.delete("/:cardId", async (req, res, next) => {
  try {
    await prisma.card.delete({ where: { id: Number(req.params.cardId) } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Oops, something witn wrong!" });
  }
  res.status(200).json({ message: "Deleted" });

  next();
});

export default card;

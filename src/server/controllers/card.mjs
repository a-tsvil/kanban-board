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

card.put("/:cardId", async (req, res, next) => {
  if (req.body.newOrdering !== 0 && !req.body.newOrdering)
    return res.status(400).json({ message: "newOrdering is missing" });
  if (req.body.targetColumnId !== 0 && !req.body.targetColumnId)
    return res.status(400).json({ message: "targetColumnId is missing" });

  const newOrdering = Number(req.body.newOrdering);
  const targetColumnId = Number(req.body.targetColumnId);
  const cardId = Number(req.params.cardId);

  if (Number.isNaN(newOrdering))
    return res
      .status(400)
      .json({ message: "newOrdering value must be a number" });
  if (Number.isNaN(targetColumnId))
    return res
      .status(400)
      .json({ message: "targetColumnId value must be a number" });
  if (Number.isNaN(cardId))
    return res.status(400).json({ message: "cardId value must be a number" });

  try {
    const column = await prisma.column.findUnique({
      where: { id: targetColumnId },
    });
    if (!column)
      return res.status(404).json({ message: "column doesn't exist" });

    await prisma.card.update({
      where: { id: cardId },
      data: {
        ordering: newOrdering,
        columnId: targetColumnId,
      },
    });
    await prisma.card.updateMany({
      where: {
        ordering: { gte: newOrdering },
        columnId: targetColumnId,
        AND: { NOT: { id: cardId } },
      },
      data: { ordering: { increment: 1 } },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Oops, something witn wrong!" });
  }

  res.status(200).json({ message: "Added" });
  next();
});

export default card;

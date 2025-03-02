const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");

const logger = require("../utils/logger")("Skill");
const { isNotValidString, isUndefined } = require("../utils/validate");

router.get("/", async (req, res, next) => {
  try {
    const skill = await dataSource.getRepository("Skill").find({
      select: ["id", "name"],
    });
    res.status(200).json({
      status: "success",
      data: skill,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (isUndefined(name) || isNotValidString(name)) {
      res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
      return;
    }
    const skillRepo = dataSource.getRepository("Skill");
    const existSkill = await skillRepo.find({
      where: {
        name,
      },
    });
    if (existSkill.length > 0) {
      res.status(409).json({
        status: "failed",
        message: "資料重複",
      });
      return;
    }
    const newSkill = await skillRepo.create({
      name,
    });
    const result = await skillRepo.save(newSkill);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.delete("/:skillId", async (req, res, next) => {
  try {
    const skillId = req.url.split("/").pop();
    if (isUndefined(skillId) || isNotValidString(skillId)) {
      res.status(400).json({
        status: "failed",
        message: "ID 錯誤",
      });
      return;
    }
    const result = await dataSource.getRepository("Skill").delete(skillId);
    if (result.affected === 0) {
      res.status(400).json({
        status: "failed",
        message: "ID 錯誤",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: result,
    });
    res.end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

module.exports = router;

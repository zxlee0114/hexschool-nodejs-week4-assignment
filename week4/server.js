require("dotenv").config();
const http = require("http");
const AppDataSource = require("./db");
// const handleError = require("./handleError");
const {
  handleResponse,
  handleSuccess,
  handleError,
} = require("./handleResponse");

const {
  isUndefined,
  isNotValidString,
  isNotValidInteger,
} = require("./validate");

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/api/credit-package" && req.method === "GET") {
    try {
      const data = await AppDataSource.getRepository("CreditPackage").find({
        select: ["id", "name", "credit_amount", "price"],
      });
      handleSuccess(res, data);
    } catch (error) {
      handleError(res, 500, "伺服器錯誤");
    }
  } else if (req.url === "/api/credit-package" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const { name, credit_amount, price } = JSON.parse(body);

        if (
          isUndefined(name) ||
          isNotValidString(name) ||
          isUndefined(credit_amount) ||
          isNotValidInteger(credit_amount) ||
          isUndefined(price) ||
          isNotValidInteger(price)
        ) {
          handleError(res, 400, "欄位未填寫正確");
          return;
        }

        const creditPackage = AppDataSource.getRepository("CreditPackage");
        const findCreditPackage = await creditPackage.find({
          where: {
            name: name,
          },
        });

        if (findCreditPackage.length > 0) {
          handleError(res, 409, "資料重複");
          return;
        }

        const newCreditPackage = creditPackage.create({
          name,
          credit_amount,
          price,
        });

        const result = await creditPackage.save(newCreditPackage);
        handleSuccess(res, result);
      } catch (error) {
        handleError(res, 500, "伺服器錯誤");
      }
    });
  } else if (
    req.url.startsWith("/api/credit-package/") &&
    req.method === "DELETE"
  ) {
    try {
      const creditPackageId = req.url.split("/").pop();

      if (isUndefined(creditPackageId) || isNotValidString(creditPackageId)) {
        handleError(res, 400, "ID 錯誤");
        return;
      }

      const result = await AppDataSource.getRepository("CreditPackage").delete(
        creditPackageId
      );
      if (result.affected === 0) {
        handleError(res, 400, "ID 錯誤");
        return;
      }
      handleResponse(res, 200);
    } catch (error) {
      handleError(res, 500, "伺服器錯誤");
    }
  } else if (req.url === "/api/coaches/skill" && req.method === "GET") {
    try {
      const data = await AppDataSource.getRepository("Skill").find({
        select: ["id", "name"],
      });
      handleSuccess(res, data);
    } catch (error) {
      handleError(res, 500, "伺服器錯誤");
    }
  } else if (req.url === "/api/coaches/skill" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const { name } = await JSON.parse(body);

        if (isUndefined(name) || isNotValidString(name)) {
          handleError(res, 400, "欄位未填寫正確");
          return;
        }

        const skillRepo = AppDataSource.getRepository("Skill");
        const findSkill = await skillRepo.find({
          where: {
            name,
          },
        });

        if (findSkill.length > 0) {
          handleError(res, 409, "資料重複");
          return;
        }

        const newSkill = skillRepo.create({ name });
        const result = await skillRepo.save(newSkill);

        handleSuccess(res, result);
      } catch (error) {
        handleError(res, 500, "伺服器錯誤");
      }
    });
  } else if (
    req.url.startsWith("/api/coaches/skill/") &&
    req.method === "DELETE"
  ) {
    try {
      const skillId = req.url.split("/").pop();

      if (isUndefined(skillId) || isNotValidString(skillId)) {
        handleError(res, 400, "ID 錯誤");
        return;
      }

      const result = await AppDataSource.getRepository("Skill").delete(skillId);

      if (result.affected === 0) {
        handleError(res, 400, "ID 錯誤");
        return;
      }

      handleResponse(res, 200);
    } catch (error) {
      handleError(res, 500, "伺服器錯誤");
    }
  } else if (req.method === "OPTIONS") {
    handleResponse(res, 200);
  } else {
    handleError(res, 404, "無此網站路由");
  }
};

const server = http.createServer(requestListener);

async function startServer() {
  await AppDataSource.initialize();
  console.log("資料庫連接成功");
  server.listen(process.env.PORT);
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`);
  return server;
}

module.exports = startServer();

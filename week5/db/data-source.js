const { DataSource } = require("typeorm");
const config = require("../config/index");

const CreditPackage = require("../entities/CreditPackages");
const Skill = require("../entities/Skill");
const User = require("../entities/User");
const Coach = require("../entities/Coach");
const Course = require("../entities/Course");
const dataSource = new DataSource({
  type: "postgres",
  host: config.get("db.host"),
  port: config.get("db.port"),
  username: config.get("db.username"),
  password: config.get("db.password"),
  database: config.get("db.database"),
  synchronize: config.get("db.synchronize"),
  poolSize: 10,
  entities: [CreditPackage, Skill, User, Coach, Course],
  ssl: config.get("db.ssl"),
});

module.exports = { dataSource };

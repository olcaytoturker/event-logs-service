const controller = require("../controllers/eventLogs.controller");
module.exports = function(app) {
  app.post(
    "/api/event-logs",
    controller.saveEventLogs
  );
  app.get(
    "/api/event-logs",
    controller.getEventLogs
  );
}

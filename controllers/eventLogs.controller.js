const {PubSub} = require('@google-cloud/pubsub');
const {BigQuery} = require('@google-cloud/bigquery');

// Service account credentials for BigQuery and PubSub are retrieved.
const bgOpt = {
    keyFilename: 'key.json',
    projectId: 'cw-event-logs-service',
};
const psOpt = {
  keyFilename: 'pub_sub_sa.json',
  projectId: 'cw-event-logs-service',
};
const pubSubClient = new PubSub(psOpt);
exports.saveEventLogs = async (req, res) => {
    try {
      // Message are sent by selected PubSub topic.
      const dataBuffer = Buffer.from(JSON.stringify(req.body));
      const messageId = await pubSubClient
        .topic("projects/cw-event-logs-service/topics/event-logs")
        .publishMessage({data: dataBuffer});
        return res.status(200).send({message:`Message ${messageId} published.`});
    } catch (error) {
      console.error(`Received error: ${error.message}`);
      return res.status(404).send({message: error.message});
    }
  };

exports.getEventLogs = async (req, res) => {
    try {
      const bigquery = new BigQuery(bgOpt);
      // Query for getting all sessions with the duration in seconds is run.
      const query = `select format_timestamp('%d/%m/%Y', timestamp_seconds(event_time)) AS time_day,session_id, user_id,max(event_time)- min(event_time) as duration
                    FROM \`cw-event-logs-service.event_log_stats.event_logs\` GROUP BY time_day, session_id, user_id order by time_day;`
      const options = {
          query: query,
          location: 'US',
      };
      const [job] = await bigquery.createQueryJob(options);
      const [sessions] = await job.getQueryResults();
      // Variables for total results and each day are initialized.
      let userIds = [];
      let dailyStats = [];
      let dailyUsers = [];
      let currentDate = "";
      let dayResults = {};
      let sessionNum = 0;
      let sessionDurations = 0;
      sessions.forEach(function(session, index) {
          // When a new day comes related variables are set again.
          if (currentDate != session.time_day){
            currentDate = session.time_day;
            dayResults["date"] = currentDate;
            dayResults["new_users"] = 0;
            dayResults["active_users"] = 0;
          }
          // If it is user's first session, number of new users on that day incremented. 
          if(!userIds.includes(session.user_id)){
            dayResults["new_users"] += 1;
            userIds.push(session.user_id);
          }
          // If it is user's first session on that day, number of active users incremented.
          if(!dailyUsers.includes(session.user_id)){
            dayResults["active_users"] += 1;
            dailyUsers.push(session.user_id);
          }
          // Number of sessions and total session duration of that are updated
          sessionNum += 1;
          sessionDurations += session.duration;
          // Result of the day pushed the list if a new day is coming or it is the last session.
          if(index == sessions.length-1 || currentDate != sessions[index+1].time_day){
            dayResults["avg_duration"] = sessionDurations/sessionNum;
            dailyStats.push(dayResults);
            // Daily results are set to initial value.
            dayResults = {}
            dailyUsers = [];
            sessionNum = 0;
            sessionDurations = 0;
          }
      });
      // Number of total users is inserted to front of the list.
      result = {};
      result["total_users"] = userIds.length;
      result["daily_stats"] = dailyStats;
      return res.status(200).send(result);
    } catch (error) {
      console.error(`Received error: ${error.message}`);
      return res.status(404).send({message: error.message});
    }
  };

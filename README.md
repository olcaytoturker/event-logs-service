# Event Log Service
I implemented a Node.js backend web service that saves the user event logs in Google's BigQuery and PubSub and retrieves the daily log results from BigQuery table.
Project is Dockerized and deployed on Kubernetes Cluster of Google Kubernetes Engine using Helm.
 

# Endpoints

## Event Logs Service - URL: http://34.172.236.242:8080/

### Saving Logs to BigQuery

Saves the given event logs with the given body using PubSub and BigQuery. 

**Endpoint:** `/api/event-logs` \
**Method:** `POST` \
**Parameters:** Event logs sent in body in JSON format.

### Getting Daily Log Results from BigQuery

Returns total active user count and daily results that includes average duration, number of new users and number of active users.

**Endpoint:** `/api/event-logs` \
**Method:** `GET` \
**Parameters:** _None_

async function initialize() {
    // Import the Google Cloud client libraries
    const {BigQuery} = require('@google-cloud/bigquery');
    // BigQuery service account info are retrieved.
    const opt = {
        keyFilename: 'key.json',
        projectId: 'cw-event-logs-service',
    };

    const options = {
        location: 'US',
    };
    const bigqueryClient = new BigQuery(opt);

    async function createDataset(datasetId) {
        // Checked if there is a dataset with the given id.
        const ds = await bigqueryClient.dataset(datasetId).exists();
        if(!ds[0]){
            // Creates dataset if it does not exist.
            const [dataset] = await bigqueryClient.createDataset(datasetId, options);
            console.log(`Dataset ${dataset.id} created.`);
        } else {
            console.log("Dataset with the given ID exists!")
        }
    }

    async function createTable(datasetId, tableId) {
        // Table is created with the schema below.
        const tableOptions = {
            location: 'US',
            schema: {
                fields: [
                    {name: 'type', type: 'STRING', mode: "Required"},
                    {name: 'session_id', type: 'STRING', mode: "Required"},
                    {name: 'event_name', type: 'STRING', mode: "Required"},
                    {name: 'event_time', type: 'INTEGER', mode: "Required"},
                    {name: 'page', type: 'STRING', mode: "Required"},
                    {name: 'country', type: 'STRING', mode: "Required"},
                    {name: 'region', type: 'STRING', mode: "Required"},
                    {name: 'city', type: 'STRING', mode: "Required"},
                    {name: 'user_id', type: 'STRING', mode: "Required"},
                ],
            },
        }
        // Checked if there is a table with the given id.
        const tableExists = await bigqueryClient.dataset(datasetId).table(tableId).exists();
        if(!tableExists[0]){
        // Create a new table in the dataset if it does not exist.
            const [table] = await bigqueryClient
            .dataset(datasetId)
            .createTable(tableId, tableOptions);
            console.log(`Table ${table.id} created.`);
        }
        else {
            console.log("Table with the given ID exists!")
        }
    }
    const datasetId = "event_log_stats";
    const tableId = "event_logs";
    await createDataset(datasetId);
    await createTable(datasetId, tableId);
}
// Exports initialize function.
const dbInit = {initialize}
module.exports = dbInit;

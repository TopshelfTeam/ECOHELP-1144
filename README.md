# ECOHELP-1144

## Install

1. Edit `config.json` with a correct `localBaseUrl` value.

2. Run `./npm run watch` or `./npm build` and `./npm start`.

3. Install the addon

## Running / Testing

1. Visit an issue in JIRA Cloud.

2. Find the `ECOHELP-1144 Issue View` issue left panel.

   _NOTE: This should display automatically but if it is not, clicking the three dots should present the panel as an option to show._

   _NOTE: Panel must be displayed in order for the logic to run properly._

3. The panel will perform an entity property lookup and do the following:

   1. If the entity property doesn't exist, a new entity property will be created using the `/rest/api/3/issue/${issue.id}/properties/history_last_index_date`. It's value will then be displayed in this panel.

   2. If the entity property already exists, the current value will display in the panel, as well as a button for updating it to the latest `DateTime`.

4. Check JQL Queries

   Included in the issue panel are two JQL calls that can be called, can be refreshed, and will display their output.

   There are also a few queries that can be called that provide useful info for this issue.

   - WORKS `/rest/api/3/search?jql=(last_index_date%20is%20not%20empty)`
   - WORKS `/rest/api/3/search?jql=(last_index_date%20<%20NOW())`
   - WORKS `/rest/api/3/search?jql=(last_index_date%20<%20"2022-09-08%2017%3A27")`
   - WORKS `/rest/api/3/search?jql=(last_index_date%20<%20NOW())`
   - DOES NOT WORK `/rest/api/3/search?jql=(last_index_date%20>%20created)`
   - DOES NOT WORK `/rest/api/3/search?jql=(last_index_date%20>%20createdDate)`
   - DOES NOT WORK `/rest/api/3/search?jql=(last_index_date%20>%updated)`
   - DOES NOT WORK `/rest/api/3/search?jql=(last_index_date%20>%20updatedDate)`

## Notes

- According to https://developer.atlassian.com/cloud/jira/platform/jira-entity-properties/
  ```
  date: indexed as a date and allows for date range searching and ordering. The expected date format is [YYYY]-[MM]-[DD]. The expected date time format is [YYYY]-[MM]-[DD]T[hh]:[mm]:[ss] with an offset from UTC of: +/-[hh]:[mm] or Z for no offset. For reference, please see ISO_8601 standard.
  ```
  While entity properties can be stored as a date `YYYY-MM-DD` or a datetime `YYYY-MM-DDTHH:mm:ssZ` with no milliseconds the JIRA search api only seems searchable using various formats that do not contain `seconds`.

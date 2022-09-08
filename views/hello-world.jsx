import React, { useEffect, useState } from "react";
import moment from "moment";

function getEntityPropertyForIssue(issueIdOrKey) {
  // eslint-disable-next-line no-undef
  return window.AP.request(
    `/rest/api/2/issue/${issueIdOrKey}/properties/history_last_index_date`,
    {}
  );
}

function setEntityPropertyForIssue(issueIdOrKey, date = new Date()) {
  // eslint-disable-next-line no-undef
  return window.AP.request(
    `/rest/api/2/issue/${issueIdOrKey}/properties/history_last_index_date`,
    {
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        // last_updated_date: date.toISOString(),
        last_updated_date: moment.utc(date).format("YYYY-MM-DDTHH:mm:ss") + "Z",
      }),
    }
  );
}

function getJQLSearch(jql) {
  // eslint-disable-next-line no-undef
  return window.AP.request(`/rest/api/3/search?jql=${jql}`, {});
}

export default function HelloWorld() {
  const [context, setContext] = useState("");
  const [entityPropertyData, setEntityPropertyData] = useState({});
  const [jqlSearchWorking, setJqlSearchWorking] = useState({});
  const [jqlSearchBroken, setJqlSearchBroken] = useState({});

  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.AP.context.getContext().then((context) => setContext(context));
  }, []);

  useEffect(() => {
    if (context) {
      getEntityPropertyForIssue(context.jira.issue.key).then(
        (entityProperty) => setEntityPropertyData(entityProperty),
        () => {
          setEntityPropertyForIssue(context.jira.issue.key).then(() =>
            getEntityPropertyForIssue(context.jira.issue.key).then(
              (entityProperty) => {
                setEntityPropertyData(entityProperty);
              }
            )
          );
        }
      );
    }
  }, [context]);

  return (
    <div>
      <button
        onClick={() => {
          // eslint-disable-next-line no-debugger
          debugger;
        }}
      >
        Debugger
      </button>
      {entityPropertyData.body && (
        <button
          onClick={() => {
            setEntityPropertyForIssue(context.jira.issue.key).then(() =>
              getEntityPropertyForIssue(context.jira.issue.key).then(
                (entityProperty) => {
                  setEntityPropertyData(entityProperty);
                }
              )
            );
          }}
        >
          Update Entity Property
        </button>
      )}
      <br />
      <br />
      <label>
        Context: <br />
        <code>{JSON.stringify(context)}</code>
      </label>
      <br />
      <br />
      <label>
        Entity Property: <br />
        <code>{JSON.stringify(entityPropertyData)}</code>
      </label>
      <br />
      <br />
      <label>
        JQL Search via Entity Property (Working):{" "}
        <button
          onClick={() => {
            getJQLSearch("(last_index_date%20is%20not%20empty)").then(
              (result) => {
                setJqlSearchWorking(result.body);
              }
            );
          }}
        >
          Search
        </button>
        <pre>/rest/api/3/search?jql=(last_index_date%20is%20not%20empty)</pre>{" "}
        <br />
        <code>{JSON.stringify(jqlSearchWorking)}</code>
      </label>
      <br />
      <br />
      <label>
        JQL Search via Entity Property (Broken):{" "}
        <button
          onClick={() => {
            getJQLSearch("(last_index_date%20>%20created)").then((result) => {
              setJqlSearchBroken(result.body);
            });
          }}
        >
          Search
        </button>
        <pre>/rest/api/3/search?jql=(last_index_date%20&gt;%20created)</pre>{" "}
        <br />
        <code>{JSON.stringify(jqlSearchBroken)}</code>
      </label>
    </div>
  );
}

import { useContext, useEffect, useState } from 'react';

import { FetchError, fetchPlaybookRuns } from '../client';

import { PlaybookRun, LimitedUser, LimitedPost } from '../types/playbook_run';

import { TeamsFxContext } from './Context';

import './Tab.css';
import RunsSidebar from './Sidebar/Sidebar';

import { makeStyles } from '@fluentui/react-components';

import IncidentDetails from './IncidentDetails/IncidentDetails';

import * as microsoftTeams from "@microsoft/teams-js";

const useClasses = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
});

export default function Tab() {
  const classes = useClasses();
  const { themeString } = useContext(TeamsFxContext);
  const [runs, setRuns] = useState<PlaybookRun[]>([]);
  const [users, setUsers] = useState<Record<string, LimitedUser>>({});
  const [posts, setPosts] = useState<Record<string, LimitedPost>>({});
  const [selectedRunId, setSelectedRunId] = useState<string>('');

  const selectedRun = runs.find((run) => run.id == selectedRunId);

  const getPlaybookRuns = async () => {
    await microsoftTeams.app.initialize();

    const mmURL = localStorage.getItem("mmcloudurl");
    if (mmURL) {
      const token = await microsoftTeams.authentication.getAuthToken()

      try {
        const results = await fetchPlaybookRuns(mmURL, token);
        setRuns(results.items);
        setUsers(results.users);
        setPosts(results.posts);
        if (results.items.length > 0) {
          setSelectedRunId(results.items[0].id);
        }
      } catch (e) {
        if (e instanceof FetchError && e.status_code == 403) {
          console.error('The Teams Tab App is not enabled for this Mattermost instance. Contact your system administrator.');
        } else {
          console.error('An error occurred loading the playbooks runs', e);
        }
      }
    };
  };

  useEffect(() => {
    getPlaybookRuns();
  }, []);

  return (
    <div
      style={{ height: '100%' }}
      className={themeString === 'default' ? 'light' : themeString === 'dark' ? 'dark' : 'contrast'}
    >
      <div className={classes.container}>
        <RunsSidebar
          runs={runs}
          users={users}
          selectedRunId={selectedRunId}
          setSelectedRunId={setSelectedRunId}
        />
        <IncidentDetails
          run={selectedRun}
          users={users}
          posts={posts}
        />
      </div>

    </div>
  );
}

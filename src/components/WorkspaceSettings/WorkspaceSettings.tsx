import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
  Text,
} from '@patternfly/react-core';
import EnvironmentListView from '../../components/Environment/EnvironmentListView';
import PageLayout from '../../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../../hooks/useQuickstartCloseOnUnmount';
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { GettingStartedCard } from '../GettingStartedCard/GettingStartedCard';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';

import './WorkspaceSettings.scss';

const GETTING_STARTED_CARD_KEY = 'environments-list-getting-started-card';

export const GettingStartedWithEnvironments = (
  <>
    Environments | Manage the continuous delivery process for your applications with environments.
    An environment is an abstraction of infrastructure used to define a continuous delivery order
    and manage application components between orders. Define if application component updates will
    be manually or automatically promoted to environments, and if changes wil be manually or
    automatically deployed.
  </>
);
export const GettingStartedWithUsers = (
  <>
    Users | Connect with your teammates and invite new users to join your workspace. We defined
    default roles with permissions and tasks to make collaboration easier, but you can customize all
    roles to meet the needs of your team.
  </>
);

export type WorkspaceSettingsProps = {
  gettingStartedSections?: React.ReactNode[];
  environmentsView?: React.ReactNode;
  tabs?: {
    key: string;
    title: string;
    content: React.ReactNode;
  }[];
};

const ENVIRONMENTS_TAB_KEY = 'environments';

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({
  gettingStartedSections = [GettingStartedWithEnvironments, GettingStartedWithUsers],
  environmentsView = <EnvironmentListView />,
  tabs,
}) => {
  useQuickstartCloseOnUnmount();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('activeTab');
  const tabMatched =
    activeTab === ENVIRONMENTS_TAB_KEY
      ? ENVIRONMENTS_TAB_KEY
      : tabs?.find((t) => t.key === activeTab)?.key;

  const setActiveTab = React.useCallback(
    (tab: string, replace = false) => {
      if ((activeTab || ENVIRONMENTS_TAB_KEY) !== tab) {
        const params = new URLSearchParams();
        params.set('activeTab', tab);
        setSearchParams(params, { replace });
      }
    },
    [setSearchParams, activeTab],
  );

  React.useEffect(() => {
    if (!tabMatched) {
      setSearchParams(new URLSearchParams(), { replace: true });
    } else {
      setActiveTab(tabMatched, true);
    }
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const environments = (
    <>
      <Text component="p" className="pf-u-mt-lg">
        Manage the continuous delivery process for your applications with environments.{' '}
        <HelpTopicLink topicId="settings">Learn more</HelpTopicLink>
      </Text>
      {environmentsView}
    </>
  );
  return (
    <>
      <GettingStartedCard
        imgClassName="pf-u-px-md-on-xl pf-u-min-width workspace-settings__card-img"
        localStorageKey={GETTING_STARTED_CARD_KEY}
        title="Manage your workspace settings"
        imgSrc={imageUrl}
        imgAlt="Illustration showing users managing workspace settings"
        data-test="workspace-settings-getting-started"
      >
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          {gettingStartedSections.map((section, index) => (
            <FlexItem key={index}>{section}</FlexItem>
          ))}
        </Flex>
      </GettingStartedCard>
      <PageLayout title="Settings">
        <PageSection
          className="workspace-settings__content"
          variant={PageSectionVariants.light}
          isFilled
        >
          <Tabs
            data-test="workspace-settings__tabs"
            onSelect={(e, k: string) => {
              setActiveTab(k);
            }}
            activeKey={activeTab || ENVIRONMENTS_TAB_KEY}
          >
            <Tab eventKey="environments" title={<TabTitleText>Environments</TabTitleText>}>
              {environments}
            </Tab>
            {tabs?.map((tab) => (
              <Tab
                key={tab.key}
                eventKey={tab.key}
                title={<TabTitleText>{tab.title}</TabTitleText>}
              >
                {tab.content}
              </Tab>
            ))}
          </Tabs>
        </PageSection>
      </PageLayout>
    </>
  );
};

export default WorkspaceSettings;
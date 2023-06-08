import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, configure, waitFor } from '@testing-library/react';
import { ServiceProviderType } from '../../../../types';
import { formikRenderer } from '../../../../utils/test-utils';
import { useAccessCheck } from '../../../ImportForm/utils/auth-utils';
import IntegrationTestSection from '../IntegrationTestSection';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => navigateMock,
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

jest.mock('../../../ImportForm/utils/auth-utils', () => ({
  useAccessCheck: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

const useAccessCheckMock = useAccessCheck as jest.Mock;

describe('IntegrationTestSection', () => {
  beforeEach(() => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);
  });
  it('should render the page header by default', async () => {
    const wrapper = formikRenderer(<IntegrationTestSection />, {
      source: 'test-source',
      secret: null,
    });
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
      expect(wrapper.getByTestId('integration-test-section-header')).toBeTruthy();
    });
  });
  it('should hide the page header when isInPage is set', async () => {
    const wrapper = formikRenderer(<IntegrationTestSection isInPage />, {
      source: 'test-source',
      secret: null,
    });
    let found;
    try {
      wrapper.getByTestId('integration-test-section-header');
      found = true;
    } catch {
      found = false;
    }

    await waitFor(() => expect(found).toEqual(false));
  });

  it('should return show error message if the repo is not accessible', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: false, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);
    formikRenderer(<IntegrationTestSection isInPage />, {
      source: 'http://test.com/testorg/test-repo',
      secret: null,
    });

    screen.getByText('Unable to access repository');
  });
});

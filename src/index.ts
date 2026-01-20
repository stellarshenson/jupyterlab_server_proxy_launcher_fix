import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { requestAPI } from './request';

/**
 * Initialization data for the jupyterlab_server_proxy_launcher_fix extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_server_proxy_launcher_fix:plugin',
  description: 'Fix to the issue that when launchers configured in the jupyter config file with svg icons are in a different category than notebooks, icons are not displayed. Also the new browser tab setting is ignored and launcher opens proxy in a separate browser tab',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension jupyterlab_server_proxy_launcher_fix is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupyterlab_server_proxy_launcher_fix settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for jupyterlab_server_proxy_launcher_fix.', reason);
        });
    }

    requestAPI<any>('hello')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_server_proxy_launcher_fix server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ILauncher } from '@jupyterlab/launcher';
import { fetchServersInfo, isKernelCategory, IServerProcess } from './serverInfo';
import { fetchSvgIcon, createTextIcon } from './iconUtils';

/**
 * Command ID prefix for server-proxy launcher fix
 */
const COMMAND_PREFIX = 'server-proxy-fix';

/**
 * Plugin that fixes SVG icons for jupyter-server-proxy launchers
 * in non-kernel categories (anything other than Notebook/Console).
 *
 * JupyterLab's launcher only renders kernelIconUrl for Notebook/Console categories.
 * For other categories, it uses the command's icon property via LabIcon.resolveReact.
 * This plugin intercepts server-proxy launcher data and re-registers items with
 * proper LabIcon-based icons for non-kernel categories.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_server_proxy_launcher_fix:plugin',
  description:
    'Fixes SVG icon display for jupyter-server-proxy launchers in non-Notebook categories',
  autoStart: true,
  optional: [ILauncher],
  activate: async (
    app: JupyterFrontEnd,
    launcher: ILauncher | null
  ): Promise<void> => {
    console.log(
      '[server-proxy-launcher-fix] Extension activated, launcher available:',
      launcher !== null
    );

    if (!launcher) {
      console.warn(
        '[server-proxy-launcher-fix] Launcher not available, nothing to fix'
      );
      return;
    }

    try {
      const serversInfo = await fetchServersInfo();
      const serverProcesses = serversInfo.server_processes || [];

      console.log(
        '[server-proxy-launcher-fix] Found server processes:',
        serverProcesses.map((sp: IServerProcess) => sp.name)
      );

      for (const serverProcess of serverProcesses) {
        const { name, launcher_entry, new_browser_tab } = serverProcess;

        // Skip disabled entries
        if (!launcher_entry.enabled) {
          console.log(
            `[server-proxy-launcher-fix] Skipping "${name}" - disabled`
          );
          continue;
        }

        // Get category, default to "Other" if not specified
        const category = launcher_entry.category || 'Other';

        // Skip kernel categories - server-proxy handles these correctly
        if (isKernelCategory(category)) {
          console.log(
            `[server-proxy-launcher-fix] Skipping "${name}" - kernel category "${category}"`
          );
          continue;
        }

        console.log(
          `[server-proxy-launcher-fix] Fixing icon for "${name}" in category "${category}"`
        );

        // Create LabIcon from the icon_url
        const iconName = `${COMMAND_PREFIX}:${name}`;
        let icon = launcher_entry.icon_url
          ? await fetchSvgIcon(launcher_entry.icon_url, iconName)
          : null;

        if (!icon) {
          console.log(
            `[server-proxy-launcher-fix] Using fallback text icon for "${name}"`
          );
          icon = createTextIcon(iconName, launcher_entry.title);
        }

        // Register a command that opens the server proxy
        const commandId = `${COMMAND_PREFIX}:open-${name}`;
        app.commands.addCommand(commandId, {
          label: launcher_entry.title,
          icon: icon,
          execute: () => {
            // Build the URL to the proxy
            const baseUrl = app.serviceManager.serverSettings.baseUrl;
            const proxyUrl = `${baseUrl}${launcher_entry.path_info}`;

            if (new_browser_tab) {
              window.open(proxyUrl, '_blank');
            } else {
              window.location.href = proxyUrl;
            }
          }
        });

        // Add to launcher with proper icon (no kernelIconUrl)
        launcher.add({
          command: commandId,
          category: category,
          rank: 1
        });

        console.log(
          `[server-proxy-launcher-fix] Registered launcher for "${name}"`
        );
      }
    } catch (error) {
      console.warn(
        '[server-proxy-launcher-fix] Failed to fetch server-proxy config:',
        error
      );
      console.warn(
        '[server-proxy-launcher-fix] This is expected if jupyter-server-proxy is not installed'
      );
    }
  }
};

export default plugin;

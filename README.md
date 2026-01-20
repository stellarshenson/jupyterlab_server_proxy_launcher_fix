# jupyterlab_server_proxy_launcher_fix

[![GitHub Actions](https://github.com/stellarshenson/jupyterlab_server_proxy_launcher_fix/actions/workflows/build.yml/badge.svg)](https://github.com/stellarshenson/jupyterlab_server_proxy_launcher_fix/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/jupyterlab_server_proxy_launcher_fix.svg)](https://www.npmjs.com/package/jupyterlab_server_proxy_launcher_fix)
[![PyPI version](https://img.shields.io/pypi/v/jupyterlab-server-proxy-launcher-fix.svg)](https://pypi.org/project/jupyterlab-server-proxy-launcher-fix/)
[![Total PyPI downloads](https://static.pepy.tech/badge/jupyterlab-server-proxy-launcher-fix)](https://pepy.tech/project/jupyterlab-server-proxy-launcher-fix)
[![JupyterLab 4](https://img.shields.io/badge/JupyterLab-4-orange.svg)](https://jupyterlab.readthedocs.io/en/stable/)
[![Brought To You By KOLOMOLO](https://img.shields.io/badge/Brought%20To%20You%20By-KOLOMOLO-00ffff?style=flat)](https://kolomolo.com)
[![Donate PayPal](https://img.shields.io/badge/Donate-PayPal-blue?style=flat)](https://www.paypal.com/donate/?hosted_button_id=B4KPBJDLLXTSA)

Fixes issues with jupyter-server-proxy launchers in JupyterLab where SVG icons fail to display and browser tab settings are ignored.

## Features

- **SVG icon display fix** - Correctly renders SVG icons for launchers placed in categories other than "Notebook"
- **Browser tab behavior fix** - Respects the `new_browser_tab` configuration setting instead of always opening in a new tab
- **Server extension** - Python backend component for proper launcher configuration handling

## Installation

Requires JupyterLab 4.0.0 or higher.

```bash
pip install jupyterlab_server_proxy_launcher_fix
```

## Uninstall

```bash
pip uninstall jupyterlab_server_proxy_launcher_fix
```

# EcoSync Home Cinema - Powered by Alexa+ and MCP

EcoSync Home Cinema is an innovative smart energy management platform designed for Amazon Vega OS and Fire TV. By leveraging Alexa+ and the latest Model Context Protocol (MCP) Streamable HTTP specification, the application balances entertainment and sustainability in real-time.

## Features

- **Alexa+ Smart Dialogues**: Beyond simple triggers, Alexa+ analyzes context to recommend energy-saving profiles during media playback.
- **MCP Streamable HTTP Transport**: Implements the 2025-11-25 MCP spec using HTTP POST and GET streams to push real-time home grid analytics directly to the TV.
- **Interactive UI (MCP Apps)**: Renders a sandboxed iframe dashboard directly on screen, displaying real-time metrics without interrupting the content.

## Prerequisites

- Node.js v24 (Recommended for stable SQLite3 bindings)
- Vega SDK v0.24 or later
- AWS Account with Alexa Developer Console access

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com
   cd ecosync-alexa-mcp
   ```

2. Initialize the Amazon Devices Builder Tools context for your AI agent:
   ```bash
   npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest init-context
   ```

3. Install dependencies for the MCP Server:
   ```bash
   cd mcp-server
   npm install
   npm run build
   ```

4. Start the MCP Server locally over Streamable HTTP:
   ```bash
   node dist/index.js --port 8080
   ```

5. Run the Vega App on the Virtual Device:
   ```bash
   cd ../vega-app
   npm install
   npm run start
   ```

## Architecture

- **Client**: Vega OS App hosting the MCP App view.
- **Server**: Custom Node.js/Express server using standard JSON-RPC over Streamable HTTP.
- **AI Layer**: Alexa+ voice models interacting via tools exposed by the MCP server.

## License
Apache 2.0

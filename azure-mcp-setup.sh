#!/bin/bash
# Complete Azure MCP Setup Script for iQube Integration

echo "🚀 Setting up Azure MCP for iQube Database Integration"
echo "=" * 60

# Create MCP directory
echo "📁 Creating project directory..."
mkdir -p azure-mcp-iqube
cd azure-mcp-iqube

# Create Python virtual environment
echo "🐍 Creating Python virtual environment..."
python3 -m venv azure-mcp-env

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source azure-mcp-env/bin/activate  # Linux/Mac
# For Windows: azure-mcp-env\Scripts\activate

# Install required dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install ODBC Driver for SQL Server
echo "🔧 Installing ODBC Driver for SQL Server..."
echo "Please install ODBC Driver 18 for SQL Server manually:"
echo ""
echo "For Ubuntu/Debian:"
echo "curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -"
echo "curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list"
echo "apt-get update"
echo "ACCEPT_EULA=Y apt-get install -y msodbcsql18"
echo ""
echo "For macOS:"
echo "brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release"
echo "brew update"
echo "HOMEBREW_NO_ENV_FILTERING=1 ACCEPT_EULA=Y brew install msodbcsql18 mssqltools18"
echo ""
echo "For Windows:"
echo "Download and install from: https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server"

# Test the setup
echo "🧪 Testing MCP server setup..."
python test_mcp_server.py

echo ""
echo "✅ Azure MCP setup complete!"
echo "📝 Next steps:"
echo "1. Configure Augment with the MCP server settings"
echo "2. Test database connectivity through Augment"
echo "3. Use MCP to debug Railway authentication issues"
echo ""
echo "📖 See AUGMENT_INTEGRATION.md for detailed instructions"

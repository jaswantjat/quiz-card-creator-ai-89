#!/usr/bin/env python3
"""
Test script for iQube Azure MCP Server
Validates all functionality and compares with Railway API
"""

import asyncio
import json
import requests
from iqube_azure_mcp_server import handle_mcp_request

class iQubeMCPTester:
    def __init__(self):
        self.railway_base_url = "https://genrate-with-ai-feature-production.up.railway.app"
        self.test_user = {
            "email": "test@iqube.com",
            "password": "TestPassword123!",
            "firstName": "Test",
            "lastName": "User"
        }
    
    async def test_database_connection(self):
        """Test database connectivity"""
        print("🔍 Testing database connection...")
        result = await handle_mcp_request("test_connection", {})
        print(f"✅ Connection result: {json.dumps(result, indent=2)}")
        return result.get("status") == "connected"
    
    async def test_database_schema_initialization(self):
        """Test database schema setup"""
        print("🏗️ Testing database schema initialization...")
        result = await handle_mcp_request("initialize_database_schema", {})
        print(f"✅ Schema result: {json.dumps(result, indent=2)}")
        return result.get("success", False)
    
    async def test_user_registration(self):
        """Test user registration"""
        print("👤 Testing user registration...")
        result = await handle_mcp_request("register_user", {
            "email": self.test_user["email"],
            "password": self.test_user["password"],
            "firstName": self.test_user["firstName"],
            "lastName": self.test_user["lastName"]
        })
        print(f"✅ Registration result: {json.dumps(result, indent=2)}")
        return result.get("success", False), result.get("user", {}).get("id")
    
    async def test_user_authentication(self):
        """Test user authentication"""
        print("🔐 Testing user authentication...")
        result = await handle_mcp_request("authenticate_user", {
            "email": self.test_user["email"],
            "password": self.test_user["password"]
        })
        print(f"✅ Authentication result: {json.dumps(result, indent=2)}")
        return result.get("success", False), result.get("token")
    
    async def test_question_topics(self):
        """Test question topics retrieval"""
        print("📚 Testing question topics...")
        result = await handle_mcp_request("get_question_topics", {})
        print(f"✅ Topics result: {json.dumps(result, indent=2)}")
        return result.get("success", False)
    
    async def test_save_question(self, user_id):
        """Test saving a question"""
        print("💾 Testing question saving...")
        question_data = {
            "question": "What are the benefits of AI in business?",
            "topic": "Business & AI",
            "difficulty": "medium",
            "questionType": "text"
        }
        result = await handle_mcp_request("save_user_question", {
            "userId": user_id,
            "questionData": question_data
        })
        print(f"✅ Save question result: {json.dumps(result, indent=2)}")
        return result.get("success", False)
    
    async def test_get_user_questions(self, user_id):
        """Test retrieving user questions"""
        print("📖 Testing user questions retrieval...")
        result = await handle_mcp_request("get_user_questions", {
            "userId": user_id
        })
        print(f"✅ User questions result: {json.dumps(result, indent=2)}")
        return result.get("success", False)
    
    async def test_database_stats(self):
        """Test database statistics"""
        print("📊 Testing database statistics...")
        result = await handle_mcp_request("get_database_stats", {})
        print(f"✅ Database stats: {json.dumps(result, indent=2)}")
        return result.get("success", False)
    
    def test_railway_health(self):
        """Test Railway health endpoint"""
        print("🚂 Testing Railway health endpoint...")
        try:
            response = requests.get(f"{self.railway_base_url}/health", timeout=10)
            result = response.json()
            print(f"✅ Railway health: {json.dumps(result, indent=2)}")
            return response.status_code == 200
        except Exception as e:
            print(f"❌ Railway health failed: {str(e)}")
            return False
    
    def test_railway_topics(self):
        """Test Railway topics endpoint"""
        print("🚂 Testing Railway topics endpoint...")
        try:
            response = requests.get(f"{self.railway_base_url}/api/questions/topics", timeout=10)
            result = response.json()
            print(f"✅ Railway topics: {json.dumps(result, indent=2)}")
            return response.status_code == 200
        except Exception as e:
            print(f"❌ Railway topics failed: {str(e)}")
            return False
    
    def test_railway_auth(self):
        """Test Railway authentication endpoint"""
        print("🚂 Testing Railway authentication endpoint...")
        try:
            response = requests.post(
                f"{self.railway_base_url}/api/auth/login",
                json={
                    "email": self.test_user["email"],
                    "password": self.test_user["password"]
                },
                timeout=10
            )
            print(f"✅ Railway auth status: {response.status_code}")
            if response.status_code != 200:
                print(f"✅ Railway auth response: {response.text}")
            return response.status_code == 200
        except Exception as e:
            print(f"❌ Railway auth failed: {str(e)}")
            return False
    
    async def run_comprehensive_test(self):
        """Run comprehensive test suite"""
        print("🧪 Starting comprehensive iQube MCP test suite...")
        print("=" * 60)
        
        results = {}
        
        # Test 1: Database Connection
        results["db_connection"] = await self.test_database_connection()
        
        # Test 2: Schema Initialization
        results["schema_init"] = await self.test_database_schema_initialization()
        
        # Test 3: Question Topics
        results["topics"] = await self.test_question_topics()
        
        # Test 4: User Registration
        reg_success, user_id = await self.test_user_registration()
        results["registration"] = reg_success
        
        # Test 5: User Authentication
        if reg_success:
            auth_success, token = await self.test_user_authentication()
            results["authentication"] = auth_success
            
            # Test 6: Save Question
            if user_id:
                results["save_question"] = await self.test_save_question(user_id)
                
                # Test 7: Get User Questions
                results["get_questions"] = await self.test_get_user_questions(user_id)
        
        # Test 8: Database Stats
        results["db_stats"] = await self.test_database_stats()
        
        # Test 9: Railway Comparison
        print("\n🚂 Testing Railway endpoints for comparison...")
        results["railway_health"] = self.test_railway_health()
        results["railway_topics"] = self.test_railway_topics()
        results["railway_auth"] = self.test_railway_auth()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        mcp_tests = ["db_connection", "schema_init", "topics", "registration", 
                    "authentication", "save_question", "get_questions", "db_stats"]
        railway_tests = ["railway_health", "railway_topics", "railway_auth"]
        
        mcp_passed = sum(1 for test in mcp_tests if results.get(test, False))
        railway_passed = sum(1 for test in railway_tests if results.get(test, False))
        
        print(f"🔍 MCP Tests: {mcp_passed}/{len(mcp_tests)} passed")
        print(f"🚂 Railway Tests: {railway_passed}/{len(railway_tests)} passed")
        
        for test, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {test}: {status}")
        
        print("\n" + "=" * 60)
        if mcp_passed == len(mcp_tests):
            print("🎉 All MCP tests passed! Azure MCP integration is working correctly.")
        else:
            print("⚠️ Some MCP tests failed. Check the logs above for details.")
        
        if railway_passed < len(railway_tests):
            print("🔧 Railway has connectivity issues - MCP provides working alternative!")
        else:
            print("✅ Railway is also working - you have dual connectivity options!")
        
        return results

if __name__ == "__main__":
    tester = iQubeMCPTester()
    asyncio.run(tester.run_comprehensive_test())

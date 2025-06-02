#!/usr/bin/env python3
"""
iQube Azure SQL MCP Server
Provides direct database access for iQube application via Model Context Protocol
"""

import os
import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
import pyodbc
import bcrypt
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO')),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('iQube-Azure-MCP')

class iQubeAzureMCPServer:
    """Azure SQL MCP Server for iQube Application"""
    
    def __init__(self):
        self.server_name = os.getenv('MCP_SERVER_NAME', 'iqube-azure-sql')
        self.version = os.getenv('MCP_SERVER_VERSION', '1.0.0')
        self.connection_string = self._build_connection_string()
        self.jwt_secret = os.getenv('IQUBE_JWT_SECRET', 'default-secret')
        self.bcrypt_rounds = int(os.getenv('IQUBE_BCRYPT_ROUNDS', '12'))
        
    def _build_connection_string(self) -> str:
        """Build Azure SQL connection string"""
        return f"""
        Driver={{ODBC Driver 18 for SQL Server}};
        Server={os.getenv('AZURE_SQL_SERVER')};
        Database={os.getenv('AZURE_SQL_DATABASE')};
        Uid={os.getenv('AZURE_SQL_USERNAME')};
        Pwd={os.getenv('AZURE_SQL_PASSWORD')};
        Encrypt=yes;
        TrustServerCertificate=no;
        Connection Timeout={os.getenv('CONNECTION_TIMEOUT', '30')};
        """
    
    async def test_connection(self) -> Dict[str, Any]:
        """Test database connectivity"""
        try:
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()
            cursor.execute("SELECT 1 as test, GETDATE() as timestamp")
            result = cursor.fetchone()
            conn.close()
            
            return {
                "status": "connected",
                "message": "Azure SQL connection successful",
                "timestamp": datetime.now().isoformat(),
                "test_query": result[0] if result else None,
                "server_time": result[1].isoformat() if result and result[1] else None
            }
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            return {
                "status": "failed",
                "message": f"Connection failed: {str(e)}",
                "timestamp": datetime.now().isoformat(),
                "error_type": type(e).__name__
            }
    
    async def check_user_exists(self, email: str) -> Dict[str, Any]:
        """Check if user exists in database"""
        try:
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, email, firstName, lastName, createdAt 
                FROM users 
                WHERE email = ?
            """, (email,))
            
            user = cursor.fetchone()
            conn.close()
            
            if user:
                return {
                    "exists": True,
                    "user": {
                        "id": user[0],
                        "email": user[1],
                        "firstName": user[2],
                        "lastName": user[3],
                        "createdAt": user[4].isoformat() if user[4] else None
                    }
                }
            else:
                return {"exists": False, "user": None}
                
        except Exception as e:
            logger.error(f"Check user exists failed: {str(e)}")
            return {
                "exists": False,
                "error": str(e),
                "error_type": type(e).__name__
            }
    
    async def authenticate_user(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user login"""
        try:
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, email, firstName, lastName, passwordHash, createdAt 
                FROM users 
                WHERE email = ?
            """, (email,))
            
            user = cursor.fetchone()
            conn.close()
            
            if not user:
                return {
                    "success": False,
                    "message": "User not found",
                    "error_code": "USER_NOT_FOUND"
                }
            
            # Verify password
            password_hash = user[4]
            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                # Generate JWT token
                token_payload = {
                    "userId": user[0],
                    "email": user[1],
                    "exp": datetime.utcnow().timestamp() + 86400  # 24 hours
                }
                token = jwt.encode(token_payload, self.jwt_secret, algorithm='HS256')
                
                return {
                    "success": True,
                    "message": "Authentication successful",
                    "user": {
                        "id": user[0],
                        "email": user[1],
                        "firstName": user[2],
                        "lastName": user[3],
                        "createdAt": user[5].isoformat() if user[5] else None
                    },
                    "token": token
                }
            else:
                return {
                    "success": False,
                    "message": "Invalid password",
                    "error_code": "INVALID_PASSWORD"
                }
                
        except Exception as e:
            logger.error(f"Authentication failed: {str(e)}")
            return {
                "success": False,
                "message": f"Authentication error: {str(e)}",
                "error_code": "AUTH_ERROR",
                "error_type": type(e).__name__
            }
    
    async def register_user(self, email: str, password: str, first_name: str, last_name: str) -> Dict[str, Any]:
        """Register new user"""
        try:
            # Check if user already exists
            existing_user = await self.check_user_exists(email)
            if existing_user.get("exists"):
                return {
                    "success": False,
                    "message": "User already exists",
                    "error_code": "USER_EXISTS"
                }
            
            # Hash password
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=self.bcrypt_rounds))
            
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO users (email, passwordHash, firstName, lastName, createdAt)
                OUTPUT INSERTED.id, INSERTED.email, INSERTED.firstName, INSERTED.lastName, INSERTED.createdAt
                VALUES (?, ?, ?, ?, GETDATE())
            """, (email, password_hash.decode('utf-8'), first_name, last_name))
            
            new_user = cursor.fetchone()
            conn.commit()
            conn.close()
            
            if new_user:
                # Generate JWT token
                token_payload = {
                    "userId": new_user[0],
                    "email": new_user[1],
                    "exp": datetime.utcnow().timestamp() + 86400  # 24 hours
                }
                token = jwt.encode(token_payload, self.jwt_secret, algorithm='HS256')
                
                return {
                    "success": True,
                    "message": "User registered successfully",
                    "user": {
                        "id": new_user[0],
                        "email": new_user[1],
                        "firstName": new_user[2],
                        "lastName": new_user[3],
                        "createdAt": new_user[4].isoformat() if new_user[4] else None
                    },
                    "token": token
                }
            else:
                return {
                    "success": False,
                    "message": "Failed to create user",
                    "error_code": "CREATE_FAILED"
                }
                
        except Exception as e:
            logger.error(f"User registration failed: {str(e)}")
            return {
                "success": False,
                "message": f"Registration error: {str(e)}",
                "error_code": "REGISTRATION_ERROR",
                "error_type": type(e).__name__
            }
    
    async def get_question_topics(self) -> Dict[str, Any]:
        """Get available question topics"""
        try:
            # For now, return static topics (can be moved to database later)
            topics = [
                {"id": 1, "name": "Business & AI", "description": "AI applications in business"},
                {"id": 2, "name": "Technology & Innovation", "description": "Emerging technologies and innovation"},
                {"id": 3, "name": "Education & Learning", "description": "Educational technology and learning methods"},
                {"id": 4, "name": "Health & Wellness", "description": "Healthcare and wellness topics"},
                {"id": 5, "name": "Science & Research", "description": "Scientific research and methodologies"}
            ]
            
            return {
                "success": True,
                "topics": topics,
                "count": len(topics)
            }
            
        except Exception as e:
            logger.error(f"Get topics failed: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to get topics: {str(e)}",
                "error_type": type(e).__name__
            }
    
    async def save_user_question(self, user_id: int, question_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save generated question for user"""
        try:
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO saved_questions (userId, questionText, topic, difficulty, questionType, createdAt)
                OUTPUT INSERTED.id, INSERTED.createdAt
                VALUES (?, ?, ?, ?, ?, GETDATE())
            """, (
                user_id,
                question_data.get('question', ''),
                question_data.get('topic', ''),
                question_data.get('difficulty', 'medium'),
                question_data.get('questionType', 'text')
            ))
            
            result = cursor.fetchone()
            conn.commit()
            conn.close()
            
            if result:
                return {
                    "success": True,
                    "message": "Question saved successfully",
                    "questionId": result[0],
                    "createdAt": result[1].isoformat() if result[1] else None
                }
            else:
                return {
                    "success": False,
                    "message": "Failed to save question",
                    "error_code": "SAVE_FAILED"
                }
                
        except Exception as e:
            logger.error(f"Save question failed: {str(e)}")
            return {
                "success": False,
                "message": f"Save error: {str(e)}",
                "error_type": type(e).__name__
            }
    
    async def get_user_questions(self, user_id: int) -> Dict[str, Any]:
        """Get user's saved questions"""
        try:
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()

            cursor.execute("""
                SELECT id, questionText, topic, difficulty, questionType, createdAt
                FROM saved_questions
                WHERE userId = ?
                ORDER BY createdAt DESC
            """, (user_id,))

            questions = []
            for row in cursor.fetchall():
                questions.append({
                    "id": row[0],
                    "question": row[1],
                    "topic": row[2],
                    "difficulty": row[3],
                    "questionType": row[4],
                    "createdAt": row[5].isoformat() if row[5] else None
                })

            conn.close()

            return {
                "success": True,
                "questions": questions,
                "count": len(questions)
            }

        except Exception as e:
            logger.error(f"Get user questions failed: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to get questions: {str(e)}",
                "error_type": type(e).__name__
            }

    async def initialize_database_schema(self) -> Dict[str, Any]:
        """Initialize database schema for iQube"""
        try:
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()

            # Create users table
            cursor.execute("""
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
                CREATE TABLE users (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    email NVARCHAR(255) UNIQUE NOT NULL,
                    passwordHash NVARCHAR(255) NOT NULL,
                    firstName NVARCHAR(100) NOT NULL,
                    lastName NVARCHAR(100) NOT NULL,
                    createdAt DATETIME2 DEFAULT GETDATE(),
                    updatedAt DATETIME2 DEFAULT GETDATE()
                )
            """)

            # Create saved_questions table
            cursor.execute("""
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='saved_questions' AND xtype='U')
                CREATE TABLE saved_questions (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    userId INT NOT NULL,
                    questionText NVARCHAR(MAX) NOT NULL,
                    topic NVARCHAR(100),
                    difficulty NVARCHAR(50),
                    questionType NVARCHAR(50),
                    createdAt DATETIME2 DEFAULT GETDATE(),
                    FOREIGN KEY (userId) REFERENCES users(id)
                )
            """)

            # Create indexes for performance
            cursor.execute("""
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_users_email')
                CREATE INDEX IX_users_email ON users(email)
            """)

            cursor.execute("""
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_saved_questions_userId')
                CREATE INDEX IX_saved_questions_userId ON saved_questions(userId)
            """)

            conn.commit()
            conn.close()

            return {
                "success": True,
                "message": "Database schema initialized successfully",
                "tables_created": ["users", "saved_questions"],
                "indexes_created": ["IX_users_email", "IX_saved_questions_userId"]
            }

        except Exception as e:
            logger.error(f"Database schema initialization failed: {str(e)}")
            return {
                "success": False,
                "message": f"Schema initialization failed: {str(e)}",
                "error_type": type(e).__name__
            }

    async def get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        try:
            conn = pyodbc.connect(self.connection_string)
            cursor = conn.cursor()

            # Get user count
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]

            # Get question count
            cursor.execute("SELECT COUNT(*) FROM saved_questions")
            question_count = cursor.fetchone()[0]

            # Get recent activity
            cursor.execute("""
                SELECT TOP 5 u.email, sq.questionText, sq.createdAt
                FROM saved_questions sq
                JOIN users u ON sq.userId = u.id
                ORDER BY sq.createdAt DESC
            """)
            recent_activity = []
            for row in cursor.fetchall():
                recent_activity.append({
                    "user_email": row[0],
                    "question": row[1][:100] + "..." if len(row[1]) > 100 else row[1],
                    "created_at": row[2].isoformat() if row[2] else None
                })

            conn.close()

            return {
                "success": True,
                "stats": {
                    "total_users": user_count,
                    "total_questions": question_count,
                    "recent_activity": recent_activity
                },
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Get database stats failed: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to get stats: {str(e)}",
                "error_type": type(e).__name__
            }

# MCP Server Methods
async def handle_mcp_request(method: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Handle MCP requests"""
    server = iQubeAzureMCPServer()
    
    try:
        if method == "test_connection":
            return await server.test_connection()
        
        elif method == "check_user_exists":
            email = params.get("email")
            if not email:
                return {"error": "Email parameter required"}
            return await server.check_user_exists(email)
        
        elif method == "authenticate_user":
            email = params.get("email")
            password = params.get("password")
            if not email or not password:
                return {"error": "Email and password parameters required"}
            return await server.authenticate_user(email, password)
        
        elif method == "register_user":
            email = params.get("email")
            password = params.get("password")
            first_name = params.get("firstName")
            last_name = params.get("lastName")
            if not all([email, password, first_name, last_name]):
                return {"error": "All user parameters required"}
            return await server.register_user(email, password, first_name, last_name)
        
        elif method == "get_question_topics":
            return await server.get_question_topics()
        
        elif method == "save_user_question":
            user_id = params.get("userId")
            question_data = params.get("questionData")
            if not user_id or not question_data:
                return {"error": "User ID and question data required"}
            return await server.save_user_question(user_id, question_data)
        
        elif method == "get_user_questions":
            user_id = params.get("userId")
            if not user_id:
                return {"error": "User ID parameter required"}
            return await server.get_user_questions(user_id)

        elif method == "initialize_database_schema":
            return await server.initialize_database_schema()

        elif method == "get_database_stats":
            return await server.get_database_stats()

        else:
            return {"error": f"Unknown method: {method}"}
    
    except Exception as e:
        logger.error(f"MCP request failed: {str(e)}")
        return {
            "error": f"Request failed: {str(e)}",
            "error_type": type(e).__name__
        }

if __name__ == "__main__":
    # Test the server
    async def test_server():
        print("🧪 Testing iQube Azure MCP Server...")
        
        # Test connection
        result = await handle_mcp_request("test_connection", {})
        print(f"Connection Test: {json.dumps(result, indent=2)}")
        
        # Test topics
        result = await handle_mcp_request("get_question_topics", {})
        print(f"Topics Test: {json.dumps(result, indent=2)}")
    
    asyncio.run(test_server())

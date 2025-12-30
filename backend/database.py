import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "atmo.db")

def get_connection():
    """Returns a connection to the SQLite database."""
    return sqlite3.connect(DB_PATH)

def init_db():
    """Initializes the database schema."""
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

def save_message(session_id: str, role: str, content: str):
    """Saves a message to the database."""
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
            (session_id, role, content)
        )
        conn.commit()

def get_history(session_id: str, limit: int = 10):
    """Retrieves the most recent messages for a session."""
    with get_connection() as conn:
        cursor = conn.execute(
            "SELECT role, content FROM messages WHERE session_id = ? ORDER BY timestamp ASC LIMIT ?",
            (session_id, limit)
        )
        return [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]

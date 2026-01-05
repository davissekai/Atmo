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
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions_meta (
                session_id TEXT PRIMARY KEY,
                title TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

def get_all_sessions():
    """Retrieves all unique sessions with a title and timestamp."""
    with get_connection() as conn:
        # Get session_id, latest timestamp from messages
        # Join with sessions_meta for custom title, fallback to first user message
        query = """
        SELECT 
            m1.session_id, 
            MAX(m1.timestamp) as last_active,
            COALESCE(sm.title, (SELECT content FROM messages m2 WHERE m2.session_id = m1.session_id AND role='user' ORDER BY id ASC LIMIT 1)) as display_title
        FROM messages m1
        LEFT JOIN sessions_meta sm ON m1.session_id = sm.session_id
        GROUP BY m1.session_id
        ORDER BY last_active DESC
        """
        cursor = conn.execute(query)
        sessions = []
        for row in cursor.fetchall():
            sid, ts, title = row
            if not title:
                title = "New Chat"
            # Truncate title if too long and it's from message content
            if len(title) > 50:
                title = title[:50] + "..."
            sessions.append({
                "id": sid,
                "title": title,
                "timestamp": ts
            })
        return sessions

def rename_session(session_id: str, new_title: str):
    """Updates the custom title for a session."""
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO sessions_meta (session_id, title) VALUES (?, ?) "
            "ON CONFLICT(session_id) DO UPDATE SET title=excluded.title, updated_at=CURRENT_TIMESTAMP",
            (session_id, new_title)
        )
        conn.commit()

def delete_session(session_id: str):
    """Deletes all messages and metadata for a session."""
    with get_connection() as conn:
        conn.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
        conn.execute("DELETE FROM sessions_meta WHERE session_id = ?", (session_id,))
        conn.commit()

import sqlite3

def clean_db():
    print("--- Cleaning atmo.db ---")
    conn = sqlite3.connect(r'C:\Users\P\PROJECTS\Work\climate assistant\atmo.db')
    cursor = conn.cursor()
    
    # 1. First, get the session_id(s) that contain the 'sea level' query
    cursor.execute("SELECT DISTINCT session_id FROM messages WHERE content LIKE '%sea level%'")
    rows = cursor.fetchall()
    
    if not rows:
        print("No sea level messages found to preserve!")
        conn.close()
        return

    sea_level_sessions = [row[0] for row in rows]
    print(f"Preserving session(s): {sea_level_sessions}")
    
    # 2. Delete everything else
    placeholders = ','.join(['?'] * len(sea_level_sessions))
    query = f"DELETE FROM messages WHERE session_id NOT IN ({placeholders})"
    cursor.execute(query, sea_level_sessions)
    
    conn.commit()
    print(f"Deleted {cursor.rowcount} stale records.")
    
    # 3. Final Check
    cursor.execute("SELECT id, session_id, role, content FROM messages")
    print("\n--- Current Database State ---")
    for row in cursor.fetchall():
        print(f"ID: {row[0]} | Role: {row[2]} | Content: {row[3][:100]}...")
        
    conn.close()

if __name__ == "__main__":
    clean_db()

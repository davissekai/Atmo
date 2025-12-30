import sqlite3

def find_sea_level():
    conn = sqlite3.connect(r'C:\Users\P\PROJECTS\Work\climate assistant\atmo.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, session_id, role, content FROM messages WHERE content LIKE '%sea level%'")
    rows = cursor.fetchall()
    for row in rows:
        print(f"ID: {row[0]} | Session: {row[1]} | Role: {row[2]} | Content: {row[3][:100]}")
    conn.close()

if __name__ == "__main__":
    find_sea_level()

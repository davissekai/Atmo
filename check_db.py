import sqlite3

def check_db():
    print("--- Reading atmo.db ---")
    try:
        conn = sqlite3.connect("atmo.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM messages")
        rows = cursor.fetchall()
        
        if not rows:
            print("Database is empty.")
        else:
            for row in rows:
                print(f"ID: {row[0]} | Session: {row[1]} | Role: {row[2]} | Content: {row[3][:50]}...")
        
        conn.close()
    except Exception as e:
        print(f"Error reading database: {e}")

if __name__ == "__main__":
    check_db()

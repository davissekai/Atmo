import subprocess
import time
import webbrowser
import os
import sys

def launch_atmo():
    print("🚀 Launching Atmo...")
    
    # 1. Start the FastAPI backend
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8001"]
    print("Starting backend server...")
    
    # Start the backend process
    backend_process = subprocess.Popen(backend_cmd)
    
    # 2. Wait for server to initialize
    print("Waiting for server to start...")
    time.sleep(3)
    
    # 3. Open browser
    url = "http://127.0.0.1:8001"
    print(f"Opening browser at {url}...")
    webbrowser.open(url)
    
    try:
        # Keep the script running to keep the background process alive if needed, 
        # but Popen already started it in the background. 
        # Actually, let's wait for the process to finish to see logs in the terminal.
        backend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping Atmo...")
        backend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    launch_atmo()

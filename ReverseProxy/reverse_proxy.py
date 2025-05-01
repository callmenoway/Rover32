import asyncio
import websockets
import socket
import tkinter as tk
from tkinter import ttk
import threading
import json
import base64
import logging
import sys
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

class WebSocketTCPProxy:
    def __init__(self, root):
        self.root = root
        self.root.title("ESP32 WebSocket-TCP Proxy")
        self.root.geometry("800x600")
        
        # State variables
        self.running = False
        self.esp32_ip = tk.StringVar(value="192.168.1.100")
        self.ws_control_port = tk.IntVar(value=8081)
        self.ws_camera_port = tk.IntVar(value=8082)
        self.tcp_control_port = tk.IntVar(value=8001)
        self.tcp_camera_port = tk.IntVar(value=8000)
        
        # Active connections
        self.control_connections = {}
        self.camera_connections = {}
        self.tcp_control_socket = None
        self.tcp_camera_socket = None
        
        # WebSocket servers
        self.control_server = None
        self.camera_server = None
        self.server_task = None
        
        # Log messages
        self.log_messages = []
        
        # Setup UI
        self.setup_ui()
    
    def setup_ui(self):
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Configuration frame
        config_frame = ttk.LabelFrame(main_frame, text="Configuration", padding="10")
        config_frame.pack(fill=tk.X, pady=10)
        
        # ESP32 IP
        ip_frame = ttk.Frame(config_frame)
        ip_frame.pack(fill=tk.X, pady=5)
        ttk.Label(ip_frame, text="ESP32 IP:", width=15).pack(side=tk.LEFT)
        ttk.Entry(ip_frame, textvariable=self.esp32_ip, width=20).pack(side=tk.LEFT, padx=5)
        
        # TCP Ports
        tcp_frame = ttk.Frame(config_frame)
        tcp_frame.pack(fill=tk.X, pady=5)
        ttk.Label(tcp_frame, text="TCP Control Port:", width=15).pack(side=tk.LEFT)
        ttk.Entry(tcp_frame, textvariable=self.tcp_control_port, width=10).pack(side=tk.LEFT, padx=5)
        ttk.Label(tcp_frame, text="TCP Camera Port:", width=15).pack(side=tk.LEFT)
        ttk.Entry(tcp_frame, textvariable=self.tcp_camera_port, width=10).pack(side=tk.LEFT, padx=5)
        
        # WebSocket Ports
        ws_frame = ttk.Frame(config_frame)
        ws_frame.pack(fill=tk.X, pady=5)
        ttk.Label(ws_frame, text="WS Control Port:", width=15).pack(side=tk.LEFT)
        ttk.Entry(ws_frame, textvariable=self.ws_control_port, width=10).pack(side=tk.LEFT, padx=5)
        ttk.Label(ws_frame, text="WS Camera Port:", width=15).pack(side=tk.LEFT)
        ttk.Entry(ws_frame, textvariable=self.ws_camera_port, width=10).pack(side=tk.LEFT, padx=5)
        
        # Status and control
        status_frame = ttk.Frame(main_frame)
        status_frame.pack(fill=tk.X, pady=10)
        
        # Start/Stop button
        self.start_btn = ttk.Button(status_frame, text="Start Proxy", command=self.toggle_proxy)
        self.start_btn.pack(side=tk.LEFT, padx=5)
        
        # Status label
        self.status_var = tk.StringVar(value="Server not running")
        ttk.Label(status_frame, textvariable=self.status_var).pack(side=tk.LEFT, padx=10)
        
        # Connection info
        self.conn_info_var = tk.StringVar(value="Control: 0 | Camera: 0")
        ttk.Label(status_frame, textvariable=self.conn_info_var).pack(side=tk.RIGHT, padx=10)
        
        # Log frame
        log_frame = ttk.LabelFrame(main_frame, text="Log", padding="10")
        log_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        # Log text
        self.log_text = tk.Text(log_frame, wrap=tk.WORD, height=15)
        self.log_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Scrollbar for log
        scrollbar = ttk.Scrollbar(log_frame, command=self.log_text.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.log_text.config(yscrollcommand=scrollbar.set)
        
        # Connection URLs
        url_frame = ttk.Frame(main_frame)
        url_frame.pack(fill=tk.X, pady=10)
        
        # Getting local IP
        local_ip = self.get_local_ip()
        self.control_url_var = tk.StringVar(value=f"ws://{local_ip}:{self.ws_control_port.get()}")
        self.camera_url_var = tk.StringVar(value=f"ws://{local_ip}:{self.ws_camera_port.get()}")
        
        ttk.Label(url_frame, text="Control WebSocket URL:").pack(anchor=tk.W)
        ttk.Entry(url_frame, textvariable=self.control_url_var, width=40, state="readonly").pack(fill=tk.X, pady=2)
        
        ttk.Label(url_frame, text="Camera WebSocket URL:").pack(anchor=tk.W)
        ttk.Entry(url_frame, textvariable=self.camera_url_var, width=40, state="readonly").pack(fill=tk.X, pady=2)
    
    def get_local_ip(self):
        """Get local IP address"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return "127.0.0.1"
    
    def toggle_proxy(self):
        if not self.running:
            self.start_proxy()
        else:
            self.stop_proxy()
    
    def start_proxy(self):
        try:
            # Update URLs with current ports
            local_ip = self.get_local_ip()
            self.control_url_var.set(f"ws://{local_ip}:{self.ws_control_port.get()}")
            self.camera_url_var.set(f"ws://{local_ip}:{self.ws_camera_port.get()}")
            
            # Start the asyncio event loop in a separate thread
            self.proxy_thread = threading.Thread(target=self.run_asyncio_loop)
            self.proxy_thread.daemon = True
            self.proxy_thread.start()
            
            self.running = True
            self.start_btn.config(text="Stop Proxy")
            self.status_var.set("Server running")
            self.log("Proxy server started")
            
        except Exception as e:
            self.log(f"Error starting proxy: {str(e)}", level="ERROR")
    
    def run_asyncio_loop(self):
        """Run the asyncio event loop in a separate thread"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            self.server_task = loop.create_task(self.start_servers())
            loop.run_until_complete(self.server_task)
        except Exception as e:
            self.log(f"Server error: {str(e)}", level="ERROR")
        finally:
            loop.close()
    
    async def start_servers(self):
        """Start WebSocket servers"""
        # Start control server
        control_server = await websockets.serve(
            self.handle_control_connection, 
            "0.0.0.0", 
            self.ws_control_port.get()
        )
        
        # Start camera server
        camera_server = await websockets.serve(
            self.handle_camera_connection, 
            "0.0.0.0", 
            self.ws_camera_port.get()
        )
        
        self.control_server = control_server
        self.camera_server = camera_server
        
        # Keep the servers running
        await asyncio.gather(
            asyncio.Future(),  # This future is never completed -> runs forever
        )
    
    async def handle_control_connection(self, websocket):
        """Handle a WebSocket connection for control commands"""
        # Generate a connection ID
        conn_id = id(websocket)
        self.control_connections[conn_id] = websocket
        self.update_connection_info()
        self.log(f"New control connection: {conn_id}")
        
        try:
            # Connect to the ESP32 TCP socket for this connection
            tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            tcp_socket.connect((self.esp32_ip.get(), self.tcp_control_port.get()))
            self.log(f"Connected to ESP32 control port for client {conn_id}")
            
            # Create a separate thread for reading from the TCP socket
            tcp_reader_thread = threading.Thread(
                target=self.tcp_to_ws_control, 
                args=(tcp_socket, websocket, conn_id)
            )
            tcp_reader_thread.daemon = True
            tcp_reader_thread.start()
            
            # Handle messages from WebSocket
            async for message in websocket:
                try:
                    # Process and forward the message to TCP
                    self.log(f"Control command from client {conn_id}: {message}")
                    tcp_socket.sendall((message + "\n").encode())
                except Exception as e:
                    self.log(f"Error sending to TCP: {str(e)}", level="ERROR")
                    break
                    
        except Exception as e:
            self.log(f"Control connection error: {str(e)}", level="ERROR")
        finally:
            # Clean up
            if conn_id in self.control_connections:
                del self.control_connections[conn_id]
            self.update_connection_info()
            self.log(f"Control connection closed: {conn_id}")
    
    def tcp_to_ws_control(self, tcp_socket, websocket, conn_id):
        """Thread that forwards data from TCP to WebSocket for control"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            tcp_socket.settimeout(0.1)  # Small timeout to check if we should stop
            
            while self.running and conn_id in self.control_connections:
                try:
                    # Try to read from TCP
                    data = tcp_socket.recv(4096)
                    if not data:
                        break
                    
                    # Forward to WebSocket
                    message = data.decode('utf-8', errors='replace').strip()
                    if message:
                        asyncio.run_coroutine_threadsafe(
                            websocket.send(message), 
                            loop
                        )
                        self.log(f"Control response to client {conn_id}: {message}")
                        
                except socket.timeout:
                    # Just a timeout, continue
                    continue
                except Exception as e:
                    self.log(f"TCP->WS control error: {str(e)}", level="ERROR")
                    break
        finally:
            tcp_socket.close()
            loop.close()
    
    async def handle_camera_connection(self, websocket):
        """Handle a WebSocket connection for camera stream"""
        # Generate a connection ID
        conn_id = id(websocket)
        self.camera_connections[conn_id] = websocket
        self.update_connection_info()
        self.log(f"New camera connection: {conn_id}")
        
        try:
            # Connect to the ESP32 TCP socket for camera
            tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            tcp_socket.connect((self.esp32_ip.get(), self.tcp_camera_port.get()))
            self.log(f"Connected to ESP32 camera port for client {conn_id}")
            
            # Create a separate thread for reading from the TCP socket
            tcp_reader_thread = threading.Thread(
                target=self.tcp_to_ws_camera, 
                args=(tcp_socket, websocket, conn_id)
            )
            tcp_reader_thread.daemon = True
            tcp_reader_thread.start()
            
            # Keep the connection alive until the client disconnects
            while self.running and conn_id in self.camera_connections:
                try:
                    # Process any incoming messages from the WebSocket (usually none for camera)
                    async for message in websocket:
                        self.log(f"Unexpected message from camera client {conn_id}: {message}")
                except websockets.exceptions.ConnectionClosed:
                    break
                except Exception as e:
                    self.log(f"Camera WebSocket error: {str(e)}", level="ERROR")
                    break
                    
        except Exception as e:
            self.log(f"Camera connection error: {str(e)}", level="ERROR")
        finally:
            # Clean up
            if conn_id in self.camera_connections:
                del self.camera_connections[conn_id]
            self.update_connection_info()
            self.log(f"Camera connection closed: {conn_id}")
    
    def tcp_to_ws_camera(self, tcp_socket, websocket, conn_id):
        """Thread that forwards camera data from TCP to WebSocket"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        buffer = bytearray()
        
        try:
            tcp_socket.settimeout(0.1)  # Small timeout to check if we should stop
            
            while self.running and conn_id in self.camera_connections:
                try:
                    # Try to read from TCP
                    data = tcp_socket.recv(4096)
                    if not data:
                        break
                    
                    buffer.extend(data)
                    
                    # Check if we have a complete JPEG
                    while len(buffer) >= 6:  # At least header size
                        # Check for JPEG SOI marker (0xFF 0xD8)
                        if buffer[0] == 0xFF and buffer[1] == 0xD8:
                            # Extract image size
                            img_size = (buffer[2] << 24) | (buffer[3] << 16) | (buffer[4] << 8) | buffer[5]
                            
                            self.log(f"Found image frame with size: {img_size} bytes")
                            
                            # Basic sanity check on image size
                            if img_size <= 0 or img_size > 1000000:  # 1MB max
                                self.log(f"Invalid image size: {img_size}, skipping", level="ERROR")
                                buffer.pop(0)
                                continue
                            
                            # Check if we have the complete image
                            if len(buffer) >= img_size + 6:
                                try:
                                    # Get the actual JPEG image data (these are standard JPEG bytes that start with FFD8)
                                    # Skip the 6-byte header (which contains the size) and use the raw JPEG data
                                    jpg_data = buffer[6:img_size+6]
                                    
                                    # Ensure it has valid JPEG header
                                    if len(jpg_data) >= 2 and jpg_data[0:2] != b'\xFF\xD8':
                                        self.log(f"Image data does not start with JPEG header, adding it", level="ERROR")
                                        jpg_data = b'\xFF\xD8\xFF\xE0\x00\x10\x4A\x46\x49\x46\x00\x01\x01\x01\x00\x48\x00\x48\x00\x00' + jpg_data
                                    
                                    # Use standard JPEG data to create a base64 string
                                    img_base64 = base64.b64encode(jpg_data).decode('utf-8')
                                    
                                    # Create the message with the base64 image data
                                    message = json.dumps({"image": img_base64})
                                    
                                    # Send to WebSocket
                                    asyncio.run_coroutine_threadsafe(
                                        websocket.send(message), 
                                        loop
                                    )
                                    
                                    self.log(f"Sent camera frame to client {conn_id}: {len(jpg_data)} bytes, base64 length: {len(img_base64)}")
                                    
                                    # Remove processed data from buffer
                                    buffer = buffer[img_size+6:]
                                    
                                except Exception as img_error:
                                    self.log(f"Error processing image: {str(img_error)}", level="ERROR")
                                    # Skip this problematic image
                                    buffer = buffer[1:]  # Just skip one byte to try again
                            else:
                                # Not enough data yet, wait for more
                                self.log(f"Waiting for more data. Have {len(buffer)} bytes, need {img_size+6}")
                                break
                        else:
                            # Not a valid JPEG header, remove first byte and try again
                            buffer.pop(0)
                    
                except socket.timeout:
                    # Just a timeout, continue
                    continue
                except Exception as e:
                    self.log(f"TCP->WS camera error: {str(e)}", level="ERROR")
                    break
        finally:
            tcp_socket.close()
            loop.close()
    
    def stop_proxy(self):
        """Stop the proxy servers"""
        self.running = False
        
        # Cancel the server task if it exists
        if self.server_task:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                self.server_task.cancel()
            except:
                pass
            loop.close()
        
        # Clear connections
        self.control_connections = {}
        self.camera_connections = {}
        self.update_connection_info()
        
        self.start_btn.config(text="Start Proxy")
        self.status_var.set("Server not running")
        self.log("Proxy server stopped")
    
    def update_connection_info(self):
        """Update the connection info display"""
        self.conn_info_var.set(f"Control: {len(self.control_connections)} | Camera: {len(self.camera_connections)}")
    
    def log(self, message, level="INFO"):
        """Add a message to the log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}"
        
        # Log to console
        if level == "ERROR":
            logging.error(message)
        else:
            logging.info(message)
        
        # Add to GUI log
        self.log_messages.append(log_entry)
        
        # Keep only the last 100 messages
        if len(self.log_messages) > 100:
            self.log_messages = self.log_messages[-100:]
        
        # Update log text widget
        def update_log():
            self.log_text.config(state=tk.NORMAL)
            self.log_text.delete(1.0, tk.END)
            for entry in self.log_messages:
                self.log_text.insert(tk.END, entry + "\n")
            self.log_text.see(tk.END)
            self.log_text.config(state=tk.DISABLED)
        
        # Schedule the update on the main thread
        self.root.after(0, update_log)

if __name__ == "__main__":
    root = tk.Tk()
    app = WebSocketTCPProxy(root)
    root.mainloop()
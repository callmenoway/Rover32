import socket
import tkinter as tk
from tkinter import ttk
import threading
import struct
from PIL import Image, ImageTk
import io

class RoverClient:
    def __init__(self, root):
        self.root = root
        self.root.title("Rover32 Control")
        self.root.geometry("800x600")
        
        # Connection variables
        self.cam_socket = None
        self.control_socket = None
        self.connected = False
        self.cam_thread = None
        
        # UI setup
        self.setup_ui()
        
        # Setup keyboard bindings
        self.setup_key_bindings()
    
    def setup_ui(self):
        # Connection frame
        conn_frame = ttk.Frame(self.root, padding="10")
        conn_frame.pack(fill=tk.X)
        
        ttk.Label(conn_frame, text="ESP32 IP:").pack(side=tk.LEFT)
        self.ip_var = tk.StringVar(value="192.168.1.100")
        ttk.Entry(conn_frame, textvariable=self.ip_var, width=15).pack(side=tk.LEFT, padx=5)
        
        self.connect_btn = ttk.Button(conn_frame, text="Connect", command=self.toggle_connection)
        self.connect_btn.pack(side=tk.LEFT, padx=5)
        
        self.status_var = tk.StringVar(value="Not connected")
        ttk.Label(conn_frame, textvariable=self.status_var).pack(side=tk.LEFT, padx=10)
        
        # Video frame
        video_frame = ttk.Frame(self.root, padding="10")
        video_frame.pack(fill=tk.BOTH, expand=True)
        
        self.canvas = tk.Canvas(video_frame, width=320, height=240, bg="black")
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        # Control frame
        ctrl_frame = ttk.Frame(self.root, padding="10")
        ctrl_frame.pack(fill=tk.X)
        
        # Movement buttons
        btn_frame = ttk.Frame(ctrl_frame)
        btn_frame.pack()
        
        # Forward button
        self.fwd_btn = ttk.Button(btn_frame, text="Forward")
        self.fwd_btn.grid(row=0, column=1, pady=5)
        self.fwd_btn.bind("<ButtonPress>", lambda e: self.send_command("forward"))
        self.fwd_btn.bind("<ButtonRelease>", lambda e: self.send_command("stop"))
        
        # Left button
        self.left_btn = ttk.Button(btn_frame, text="Left")
        self.left_btn.grid(row=1, column=0, padx=5)
        self.left_btn.bind("<ButtonPress>", lambda e: self.send_command("steer:30"))
        self.left_btn.bind("<ButtonRelease>", lambda e: self.send_command("steer:90"))
        
        # Stop button
        self.stop_btn = ttk.Button(btn_frame, text="Stop", command=lambda: self.send_command("stop"))
        self.stop_btn.grid(row=1, column=1)
        
        # Right button
        self.right_btn = ttk.Button(btn_frame, text="Right")
        self.right_btn.grid(row=1, column=2, padx=5)
        self.right_btn.bind("<ButtonPress>", lambda e: self.send_command("steer:130"))
        self.right_btn.bind("<ButtonRelease>", lambda e: self.send_command("steer:90"))
        
        # Backward button
        self.back_btn = ttk.Button(btn_frame, text="Backward")
        self.back_btn.grid(row=2, column=1, pady=5)
        self.back_btn.bind("<ButtonPress>", lambda e: self.send_command("backward"))
        self.back_btn.bind("<ButtonRelease>", lambda e: self.send_command("stop"))
        
        # Steering slider
        slider_frame = ttk.Frame(ctrl_frame, padding="10")
        slider_frame.pack(fill=tk.X, pady=10)
        
        ttk.Label(slider_frame, text="Steering:").pack(side=tk.LEFT)
        self.steering_var = tk.IntVar(value=90)
        self.steering_slider = ttk.Scale(
            slider_frame, 
            from_=30, 
            to=130, 
            orient=tk.HORIZONTAL, 
            variable=self.steering_var,
            command=self.steering_changed
        )
        self.steering_slider.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        
        # Feature buttons
        feature_frame = ttk.Frame(ctrl_frame, padding="10")
        feature_frame.pack(fill=tk.X)
        
        ttk.Button(feature_frame, text="Lights On", command=lambda: self.send_command("lights_on")).pack(side=tk.LEFT, padx=5)
        ttk.Button(feature_frame, text="Lights Off", command=lambda: self.send_command("lights_off")).pack(side=tk.LEFT, padx=5)
        ttk.Button(feature_frame, text="Drift 1", command=lambda: self.send_command("drift")).pack(side=tk.LEFT, padx=5)
        ttk.Button(feature_frame, text="Drift 2", command=lambda: self.send_command("drift1")).pack(side=tk.LEFT, padx=5)
    
    def setup_key_bindings(self):
        # W key - forward
        self.root.bind("<KeyPress-w>", lambda e: self.send_command("forward"))
        self.root.bind("<KeyRelease-w>", lambda e: self.send_command("stop"))
        
        # S key - backward
        self.root.bind("<KeyPress-s>", lambda e: self.send_command("backward"))
        self.root.bind("<KeyRelease-s>", lambda e: self.send_command("stop"))
        
        # A key - steer left (reduced from 30 to 60)
        self.root.bind("<KeyPress-a>", lambda e: self.send_command("steer:60"))
        self.root.bind("<KeyRelease-a>", lambda e: self.send_command("steer:90"))
        
        # D key - steer right (reduced from 130 to 120)
        self.root.bind("<KeyPress-d>", lambda e: self.send_command("steer:120"))
        self.root.bind("<KeyRelease-d>", lambda e: self.send_command("steer:90"))
        
        # Also bind capital letters for when caps lock is on
        self.root.bind("<KeyPress-W>", lambda e: self.send_command("forward"))
        self.root.bind("<KeyRelease-W>", lambda e: self.send_command("stop"))
        self.root.bind("<KeyPress-S>", lambda e: self.send_command("backward"))
        self.root.bind("<KeyRelease-S>", lambda e: self.send_command("stop"))
        self.root.bind("<KeyPress-A>", lambda e: self.send_command("steer:60"))
        self.root.bind("<KeyRelease-A>", lambda e: self.send_command("steer:90"))
        self.root.bind("<KeyPress-D>", lambda e: self.send_command("steer:120"))
        self.root.bind("<KeyRelease-D>", lambda e: self.send_command("steer:90"))
        
        # Space for emergency stop
        self.root.bind("<space>", lambda e: self.send_command("stop"))

    def toggle_connection(self):
        if not self.connected:
            self.connect()
        else:
            self.disconnect()
    
    def connect(self):
        ip = self.ip_var.get()
        
        try:
            # Connect to control socket
            self.control_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.control_socket.connect((ip, 8001))
            
            # Connect to camera socket
            self.cam_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.cam_socket.connect((ip, 8000))
            
            self.connected = True
            self.connect_btn.config(text="Disconnect")
            self.status_var.set("Connected to " + ip)
            
            # Start camera thread
            self.cam_thread = threading.Thread(target=self.receive_camera_data)
            self.cam_thread.daemon = True
            self.cam_thread.start()
            
        except Exception as e:
            self.status_var.set(f"Connection error: {str(e)}")
    
    def disconnect(self):
        self.connected = False
        
        if self.control_socket:
            self.control_socket.close()
            self.control_socket = None
            
        if self.cam_socket:
            self.cam_socket.close()
            self.cam_socket = None
        
        self.connect_btn.config(text="Connect")
        self.status_var.set("Disconnected")
    
    def send_command(self, command):
        if self.connected and self.control_socket:
            try:
                self.control_socket.sendall((command + "\n").encode())
            except:
                self.status_var.set("Error sending command")
                self.disconnect()
    
    def steering_changed(self, value):
        angle = int(float(value))
        self.send_command(f"steer:{angle}")
    
    def receive_camera_data(self):
        buffer = bytearray()
        
        while self.connected and self.cam_socket:
            try:
                # Read data
                data = self.cam_socket.recv(4096)
                if not data:
                    break
                
                buffer.extend(data)
                
                # Check if we have a complete JPEG
                while len(buffer) >= 6:  # At least header size
                    # Check for JPEG SOI marker (0xFF 0xD8)
                    if buffer[0] == 0xFF and buffer[1] == 0xD8:
                        # Extract image size
                        img_size = (buffer[2] << 24) | (buffer[3] << 16) | (buffer[4] << 8) | buffer[5]
                        
                        # Check if we have the complete image
                        if len(buffer) >= img_size + 6:
                            # Extract the image data (skip 6-byte header)
                            img_data = buffer[6:img_size+6]
                            
                            # Process the image
                            self.process_image(img_data)
                            
                            # Remove processed data from buffer
                            buffer = buffer[img_size+6:]
                        else:
                            # Not enough data yet
                            break
                    else:
                        # Not a valid JPEG header, remove first byte and try again
                        buffer.pop(0)
            
            except Exception as e:
                print(f"Camera error: {str(e)}")
                break
        
        print("Camera thread exited")
    
    def process_image(self, img_data):
        try:
            # Convert bytes to image
            image = Image.open(io.BytesIO(img_data))
            
            # Convert to Tkinter PhotoImage
            tk_image = ImageTk.PhotoImage(image)
            
            # Update the canvas
            self.canvas.config(width=tk_image.width(), height=tk_image.height())
            self.canvas.create_image(0, 0, anchor=tk.NW, image=tk_image)
            self.canvas.image = tk_image  # Keep a reference to prevent garbage collection
            
        except Exception as e:
            print(f"Image processing error: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = RoverClient(root)
    root.mainloop()
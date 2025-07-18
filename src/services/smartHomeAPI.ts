import {
  ApiResponse,
  Device,
  Room,
  Automation,
  DeviceCommand,
  VoiceCommand,
} from '../types/smartHome';

class SmartHomeAPI {
  private baseUrl: string;
  private wsConnection: WebSocket | null = null;
  private subscribers: Map<string, Function[]> = new Map();

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  ) {
    this.baseUrl = baseUrl;
  }

  // Device Management
  async getDevices(): Promise<ApiResponse<Device[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/devices`);
      const data = await response.json();
      return {
        success: true,
        data: data.devices,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch devices',
        timestamp: new Date(),
      };
    }
  }

  async getDevice(deviceId: string): Promise<ApiResponse<Device>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/devices/${deviceId}`);
      const data = await response.json();
      return {
        success: true,
        data: data.device,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch device',
        timestamp: new Date(),
      };
    }
  }

  async controlDevice(command: DeviceCommand): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/devices/${command.deviceId}/control`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            command: command.command,
            value: command.value,
          }),
        }
      );

      const data = await response.json();
      return {
        success: true,
        data: data,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to control device',
        timestamp: new Date(),
      };
    }
  }

  async addDevice(
    device: Omit<Device, 'id' | 'lastUpdated'>
  ): Promise<ApiResponse<Device>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });

      const data = await response.json();
      return {
        success: true,
        data: data.device,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add device',
        timestamp: new Date(),
      };
    }
  }

  // Room Management
  async getRooms(): Promise<ApiResponse<Room[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms`);
      const data = await response.json();
      return {
        success: true,
        data: data.rooms,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch rooms',
        timestamp: new Date(),
      };
    }
  }

  async getRoomDevices(roomId: string): Promise<ApiResponse<Device[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/rooms/${roomId}/devices`
      );
      const data = await response.json();
      return {
        success: true,
        data: data.devices,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch room devices',
        timestamp: new Date(),
      };
    }
  }

  // Automation Management
  async getAutomations(): Promise<ApiResponse<Automation[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/automations`);
      const data = await response.json();
      return {
        success: true,
        data: data.automations,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch automations',
        timestamp: new Date(),
      };
    }
  }

  async createAutomation(
    automation: Omit<Automation, 'id'>
  ): Promise<ApiResponse<Automation>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/automations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(automation),
      });

      const data = await response.json();
      return {
        success: true,
        data: data.automation,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create automation',
        timestamp: new Date(),
      };
    }
  }

  async toggleAutomation(
    automationId: string,
    isActive: boolean
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/automations/${automationId}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isActive }),
        }
      );

      const data = await response.json();
      return {
        success: true,
        data: data,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to toggle automation',
        timestamp: new Date(),
      };
    }
  }

  // Voice Commands
  async processVoiceCommand(
    audioBlob: Blob
  ): Promise<ApiResponse<VoiceCommand>> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch(`${this.baseUrl}/api/voice/process`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return {
        success: true,
        data: data.command,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process voice command',
        timestamp: new Date(),
      };
    }
  }

  async textToSpeech(text: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/voice/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const audioBlob = await response.blob();
      return {
        success: true,
        data: audioBlob,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to synthesize speech',
        timestamp: new Date(),
      };
    }
  }

  // WebSocket Connection for Real-time Updates
  connectWebSocket(): void {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws';
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onopen = () => {
      console.log('WebSocket connected');
      this.emit('connection', { status: 'connected' });
    };

    this.wsConnection.onmessage = event => {
      try {
        const message = JSON.parse(event.data);
        this.emit(message.type, message.payload);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.wsConnection.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('connection', { status: 'disconnected' });

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        this.connectWebSocket();
      }, 3000);
    };

    this.wsConnection.onerror = error => {
      console.error('WebSocket error:', error);
      this.emit('error', { error });
    };
  }

  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Device Discovery
  async discoverDevices(): Promise<ApiResponse<Device[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/devices/discover`, {
        method: 'POST',
      });

      const data = await response.json();
      return {
        success: true,
        data: data.devices,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to discover devices',
        timestamp: new Date(),
      };
    }
  }

  // Energy Monitoring
  async getEnergyData(
    deviceId?: string,
    timeRange?: string
  ): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (deviceId) params.append('deviceId', deviceId);
      if (timeRange) params.append('timeRange', timeRange);

      const response = await fetch(`${this.baseUrl}/api/energy?${params}`);
      const data = await response.json();
      return {
        success: true,
        data: data.energyData,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch energy data',
        timestamp: new Date(),
      };
    }
  }

  // Security
  async getSecurityEvents(limit?: number): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(
        `${this.baseUrl}/api/security/events?${params}`
      );
      const data = await response.json();
      return {
        success: true,
        data: data.events,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch security events',
        timestamp: new Date(),
      };
    }
  }
}

// Singleton instance
export const smartHomeAPI = new SmartHomeAPI();
export default SmartHomeAPI;

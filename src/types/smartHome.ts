import { z } from 'zod';

// Smart Home Device API Types
export const DeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    'light',
    'thermostat',
    'camera',
    'lock',
    'sensor',
    'switch',
    'outlet',
  ]),
  brand: z.string(),
  model: z.string().optional(),
  room: z.string(),
  status: z.enum(['ON', 'OFF', 'OFFLINE']),
  connectionStatus: z.enum(['Auto', 'Manual', 'Disconnected']),
  wifiStrength: z.number().min(0).max(4),
  properties: z.record(z.any()).optional(),
  lastUpdated: z.date().optional(),
});

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    'bedroom',
    'living-room',
    'kitchen',
    'bathroom',
    'office',
    'garage',
  ]),
  devices: z.array(z.string()),
  automation: z.array(z.string()).optional(),
});

export const AutomationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['schedule', 'trigger', 'scene']),
  isActive: z.boolean(),
  conditions: z.array(
    z.object({
      type: z.string(),
      value: z.any(),
      operator: z.string().optional(),
    })
  ),
  actions: z.array(
    z.object({
      deviceId: z.string(),
      command: z.string(),
      value: z.any(),
    })
  ),
  schedule: z
    .object({
      days: z.array(z.number()).optional(),
      time: z.string().optional(),
      repeat: z.boolean().optional(),
    })
    .optional(),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  language: z.string(),
  notifications: z.boolean(),
  voiceCommands: z.boolean(),
  autoLock: z.boolean(),
  biometric: z.boolean(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(['info', 'warning', 'error', 'success']),
  title: z.string(),
  message: z.string(),
  timestamp: z.date(),
  read: z.boolean(),
  actions: z
    .array(
      z.object({
        label: z.string(),
        action: z.string(),
      })
    )
    .optional(),
});

// WebSocket Message Types
export const WebSocketMessageSchema = z.object({
  type: z.enum([
    'device-update',
    'automation-trigger',
    'notification',
    'system-alert',
  ]),
  payload: z.any(),
  timestamp: z.date(),
});

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
});

// Type exports
export type Device = z.infer<typeof DeviceSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Automation = z.infer<typeof AutomationSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
};

// Device Control Commands
export interface DeviceCommand {
  deviceId: string;
  command:
    | 'turn_on'
    | 'turn_off'
    | 'set_brightness'
    | 'set_temperature'
    | 'set_color';
  value?: any;
}

// Voice Command Types
export interface VoiceCommand {
  text: string;
  intent: 'device_control' | 'automation' | 'query' | 'system';
  entities: {
    device?: string;
    room?: string;
    action?: string;
    value?: any;
  };
  confidence: number;
}

// Energy Monitoring Types
export interface EnergyData {
  deviceId: string;
  timestamp: Date;
  power: number; // watts
  energy: number; // kWh
  voltage: number;
  current: number;
}

// Security Event Types
export interface SecurityEvent {
  id: string;
  type:
    | 'motion_detected'
    | 'door_opened'
    | 'alarm_triggered'
    | 'unauthorized_access';
  deviceId: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
}

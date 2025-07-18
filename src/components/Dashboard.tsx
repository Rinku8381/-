"use client";

import { useState, useEffect } from "react";
import { Device } from "./DeviceCards";
import RoomSelector from "./RoomSelector";
import { CyberpunkSpinner } from "./LoadingComponents";
import DeviceCards from "./DeviceCards";

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [selectedRoom, setSelectedRoom] = useState<string>("living-room");
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
      setDevices([
        {
          id: "1",
          name: "Smart Light",
          type: "light",
          brand: "Seraphine",
          status: "ON",
          connectionStatus: "Auto",
          wifiStrength: 4,
          room: "living-room"
        },
        {
          id: "2",
          name: "Thermostat",
          type: "thermostat",
          brand: "Seraphine",
          status: "ON",
          connectionStatus: "Auto",
          wifiStrength: 3,
          room: "living-room"
        },
        {
          id: "3",
          name: "Security Camera",
          type: "camera",
          brand: "Seraphine",
          status: "ON",
          connectionStatus: "Auto",
          wifiStrength: 4,
          room: "entrance"
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">Seraphine Dashboard</h1>
          <button
            onClick={onLogout}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="flex gap-4 mb-6">
          <RoomSelector
            selectedRoomId={selectedRoom}
            onRoomSelect={setSelectedRoom}
          />
        </div>

        {isLoading ? (
          <CyberpunkSpinner
            size="medium"
            color="primary"
            text="Loading..."
          />
        ) : (
          <DeviceCards
            roomName={selectedRoom}
            devices={devices.filter((device) => device.room === selectedRoom)}
          />
        )}
      </main>
    </div>
  );
}

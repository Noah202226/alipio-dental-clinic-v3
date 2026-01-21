"use client";

import React, { useState, useEffect } from "react";
import { databases, ID } from "@/app/lib/appwrite";
import { Query } from "appwrite";
import toast from "react-hot-toast";
import { Trash2, Plus, Calendar as CalIcon, Edit3 } from "lucide-react";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const SCHEDULE_COLLECTION_ID = "clinic_schedules";

const DEFAULT_WEEK_CONFIG = {
  Monday: { open: "09:00", close: "17:00", active: true },
  Tuesday: { open: "09:00", close: "17:00", active: true },
  Wednesday: { open: "09:00", close: "17:00", active: true },
  Thursday: { open: "09:00", close: "17:00", active: true },
  Friday: { open: "09:00", close: "17:00", active: true },
  Saturday: { open: "09:00", close: "12:00", active: true },
  Sunday: { open: "00:00", close: "00:00", active: false },
};

export default function ClinicScheduleSettings() {
  const [schedules, setSchedules] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [newName, setNewName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentConfig, setCurrentConfig] = useState(DEFAULT_WEEK_CONFIG);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        SCHEDULE_COLLECTION_ID,
        [Query.orderDesc("priority")],
      );
      setSchedules(res.documents);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setNewName("");
    setStartDate("");
    setEndDate("");
    setCurrentConfig(DEFAULT_WEEK_CONFIG);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (sch) => {
    setEditingId(sch.$id);
    setNewName(sch.name);
    // Convert ISO string back to YYYY-MM-DD for the date input
    setStartDate(new Date(sch.startDate).toISOString().split("T")[0]);
    setEndDate(new Date(sch.endDate).toISOString().split("T")[0]);
    setCurrentConfig(JSON.parse(sch.config));
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!newName || !startDate || !endDate)
      return toast.error("Fill all fields");

    const payload = {
      name: newName,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      config: JSON.stringify(currentConfig),
      priority: 10,
    };

    try {
      if (editingId) {
        // UPDATE EXISTING
        await databases.updateDocument(
          DATABASE_ID,
          SCHEDULE_COLLECTION_ID,
          editingId,
          payload,
        );
        toast.success("Schedule Updated");
      } else {
        // CREATE NEW
        await databases.createDocument(
          DATABASE_ID,
          SCHEDULE_COLLECTION_ID,
          ID.unique(),
          payload,
        );
        toast.success("Schedule Range Added");
      }
      resetForm();
      fetchSchedules();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this schedule?")) {
      await databases.deleteDocument(DATABASE_ID, SCHEDULE_COLLECTION_ID, id);
      fetchSchedules();
      toast.success("Schedule Deleted");
    }
  };

  const updateDay = (day, field, value) => {
    setCurrentConfig((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CalIcon className="text-blue-600" /> Operating Hours
        </h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> New Date Range
          </button>
        )}
      </div>

      {/* List Existing Schedules */}
      {!isCreating && (
        <div className="space-y-4">
          {schedules.map((sch) => (
            <div
              key={sch.$id}
              className="border p-4 rounded-lg flex justify-between items-center bg-gray-50 hover:border-blue-200 transition-colors"
            >
              <div>
                <h3 className="font-bold text-lg text-zinc-800">{sch.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(sch.startDate).toDateString()} —{" "}
                  {new Date(sch.endDate).toDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(sch)}
                  className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(sch.$id)}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {schedules.length === 0 && (
            <p className="text-gray-400 italic">No schedules set.</p>
          )}
        </div>
      )}

      {/* Form (Create & Edit) */}
      {isCreating && (
        <div className="animate-in fade-in slide-in-from-top-4 space-y-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-sm text-blue-800 font-medium">
              {editingId
                ? "Editing Schedule Range"
                : "Creating New Schedule Range"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500">
                Schedule Name
              </label>
              <input
                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Summer Hours"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500">
                Start Date
              </label>
              <input
                type="date"
                className="w-full border p-2 rounded mt-1 outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500">
                End Date
              </label>
              <input
                type="date"
                className="w-full border p-2 rounded mt-1 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white">
            <div className="bg-gray-50 p-2 text-xs font-bold text-gray-400 border-b uppercase">
              Configure Weekdays
            </div>
            {Object.keys(DEFAULT_WEEK_CONFIG).map((day) => (
              <div
                key={day}
                className="flex items-center gap-4 p-3 border-b last:border-0 hover:bg-gray-50"
              >
                <div className="w-24 font-semibold text-zinc-700">{day}</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentConfig[day].active}
                    onChange={(e) => updateDay(day, "active", e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm">
                    {currentConfig[day].active ? "Open" : "Closed"}
                  </span>
                </label>

                {currentConfig[day].active && (
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="time"
                      className="border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                      value={currentConfig[day].open}
                      onChange={(e) => updateDay(day, "open", e.target.value)}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="time"
                      className="border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                      value={currentConfig[day].close}
                      onChange={(e) => updateDay(day, "close", e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              {editingId ? "Update Schedule" : "Save Schedule"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

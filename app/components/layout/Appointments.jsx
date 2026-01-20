"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  Plus,
  CheckCircle,
  XCircle,
  Stethoscope,
  Trash2,
  User,
  Mail,
  X,
  FileText,
} from "lucide-react";
import { databases, client, ID } from "@/app/lib/appwrite";
import { Query } from "appwrite";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID = "appointments";

export default function AppointmentManager() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("Pending");
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    email: "",
    date: "",
    notes: "", // Added notes state
    status: "pending",
  });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.orderAsc("date"),
        ]);
        setEvents(res.documents.map((d) => ({ ...d, date: new Date(d.date) })));
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
    const unsub = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
      fetchDocs,
    );
    return () => unsub();
  }, []);

  const filteredEvents = useMemo(() => {
    let list = events;
    if (viewMode === "Pending")
      list = events.filter((e) => e.status === "pending");
    if (viewMode === "Confirmed")
      list = events.filter((e) => e.status === "confirmed");
    return list.sort((a, b) => a.date - b.date);
  }, [events, viewMode]);

  const handleUpdateStatus = async (event, status) => {
    const loadingToast = toast.loading(`Updating to ${status}...`);
    try {
      // 1. Update Appwrite
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, event.$id, {
        status,
      });

      // 2. Trigger the Nodemailer API
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: event.email,
          patientName: event.title,
          date: event.date.toLocaleString(),
          status: status,
          notes: event.notes, // Now correctly included!
        }),
      });

      if (!response.ok)
        throw new Error("Database updated, but email failed to send.");

      toast.success(`${event.title} has been notified.`, { id: loadingToast });
    } catch (e) {
      toast.error(`Error: ${e.message}`, { id: loadingToast });
    }
  };

  const handleSave = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.email) {
      return toast.error("Please fill in name, email, and date.");
    }
    setIsSaving(true);
    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        title: newEvent.title,
        email: newEvent.email,
        date: new Date(newEvent.date).toISOString(),
        notes: newEvent.notes, // Save notes to Appwrite
        status: newEvent.status,
      });
      toast.success("Appointment added");
      setShowModal(false);
      setNewEvent({
        title: "",
        email: "",
        date: "",
        notes: "",
        status: "pending",
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to render status badges
  const renderStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <span
        className={clsx(
          "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border",
          styles[status] || "bg-gray-100 text-gray-600",
        )}
      >
        {status}
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[var(--theme-color)]" size={40} />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--theme-color)] flex items-center gap-2">
          <Stethoscope size={28} /> Appointments
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[var(--theme-color)] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={18} /> Add Patient
        </button>
      </div>

      <div className="flex space-x-4 border-b">
        {["Pending", "Confirmed", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => setViewMode(tab)}
            className={clsx(
              "pb-3 px-2 font-semibold transition-all border-b-2",
              viewMode === tab
                ? "border-[var(--theme-color)] text-[var(--theme-color)]"
                : "border-transparent text-gray-400",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.$id}
            className="bg-white p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-full text-[var(--theme-color)] mt-1">
                <User size={20} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {event.title}
                  </h3>
                  {/* DISPLAY STATUS HERE */}
                  {renderStatusBadge(event.status)}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {event.email}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--theme-color)] font-medium">
                    <Clock size={14} /> {event.date.toLocaleString()}
                  </span>
                </div>
                {event.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-600 border-l-2 border-amber-400 italic">
                    " {event.notes} "
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
              {event.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleUpdateStatus(event, "confirmed")}
                    className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg font-semibold transition-colors"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(event, "cancelled")}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-400 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                  >
                    <XCircle size={18} /> Decline
                  </button>
                </>
              ) : (
                <button
                  onClick={async () => {
                    if (confirm("Delete this?"))
                      await databases.deleteDocument(
                        DATABASE_ID,
                        COLLECTION_ID,
                        event.$id,
                      );
                  }}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Notes Textarea */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Clinic Entry</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 mt-1 border rounded-xl focus:ring-2 focus:ring-[var(--theme-color)] outline-none"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3 mt-1 border rounded-xl focus:ring-2 focus:ring-[var(--theme-color)] outline-none"
                  value={newEvent.email}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 mt-1 border rounded-xl focus:ring-2 focus:ring-[var(--theme-color)] outline-none"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>

              {/* Added Status Selection */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Appointment Status
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 mt-1 border rounded-xl focus:ring-2 focus:ring-[var(--theme-color)] outline-none bg-white cursor-pointer"
                    value={newEvent.status}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending Review</option>
                    <option value="confirmed">Mark as Confirmed</option>
                    <option value="cancelled">Mark as Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Notes / Reason for Visit
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 mt-1 border rounded-xl focus:ring-2 focus:ring-[var(--theme-color)] outline-none resize-none"
                  placeholder="Toothache, cleaning, etc."
                  value={newEvent.notes}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, notes: e.target.value })
                  }
                />
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 font-bold bg-[var(--theme-color)] text-white rounded-xl shadow-lg transition hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Confirm Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { AppProvider, useApp } from "@/lib/vitalic/VitalicContext";

function SyncTester() {
    const { waterIntake, addWater, authUser, todayContext, toggleTask, completedTaskIds } = useApp();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Vitalic Context Test</h1>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                <h2 className="text-lg font-bold mb-2">Auth Status</h2>
                <p>User: {authUser ? authUser.email : 'Not logged in'}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                <h2 className="text-lg font-bold mb-2">Phase Data</h2>
                <p>Current Phase: {todayContext.phase}</p>
                <p>Cycle Day: {todayContext.cycleDay}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                <h2 className="text-lg font-bold mb-2">Water Logic Setup Test</h2>
                <p>Water Intake: {waterIntake} ml</p>
                <button
                    onClick={() => addWater(250)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2 font-medium"
                >
                    +250ml Water
                </button>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                <h2 className="text-lg font-bold mb-2">Habits Dummy Trigger</h2>
                <p>Completed Tasks: {completedTaskIds.length}</p>
                <button
                    onClick={() => toggleTask(`test_task_${Date.now()}`)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mt-2 font-medium"
                >
                    Complete Test Task
                </button>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <AppProvider>
            <SyncTester />
        </AppProvider>
    );
}

import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import {
    LayoutDashboard,
    Map as MapIcon,
    Bell,
    Users,
    ShieldAlert,
    Activity,
    LogOut,
    Search,
    Plus,
    ArrowRight,
    UserCheck,
    Send,
    AlertTriangle,
    MapPin,
    Trash2,
    ArrowUpCircle,
} from "lucide-react";

// Components
import GeoMap from "./components/GeoMap";

// Leaflet
import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    useMapEvents,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function App() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [doctorName, setDoctorName] = useState(
        () => localStorage.getItem("doctor_name") || "Dr.",
    );
    const [isEditingDoc, setIsEditingDoc] = useState(false);

    useEffect(() => {
        fetchData();
        const usersSub = supabase
            .channel("users-all")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "users" },
                fetchData,
            )
            .subscribe();
        return () => {
            supabase.removeChannel(usersSub);
        };
    }, []);

    const saveDoctorName = (e) => {
        e?.preventDefault();
        localStorage.setItem("doctor_name", doctorName);
        setIsEditingDoc(false);
    };

    async function fetchData() {
        try {
            const { data: usersData } = await supabase
                .from("users")
                .select("*")
                .order("updated_at", { ascending: false });
            const { data: reportsData } = await supabase
                .from("reports")
                .select("*, users(name)")
                .order("created_at", { ascending: false })
                .limit(10);
            if (usersData) setUsers(usersData);
            if (reportsData) setReports(reportsData);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar - Design de base */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <img
                        src="/medias/logo.png"
                        alt="H Logo"
                        className="w-8 h-8 rounded-lg"
                    />
                    <h1 className="text-xl font-bold tracking-tight text-black">
                        Santé Command
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem
                        icon={<LayoutDashboard size={20} />}
                        label="Vue d'ensemble"
                        active={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                    />
                    <NavItem
                        icon={<MapIcon size={20} />}
                        label="Gestion des Zones"
                        active={activeTab === "map"}
                        onClick={() => setActiveTab("map")}
                    />
                    <NavItem
                        icon={<Bell size={20} />}
                        label="Diffusion d'Alertes"
                        active={activeTab === "alerts"}
                        onClick={() => setActiveTab("alerts")}
                    />
                    <NavItem
                        icon={<Users size={20} />}
                        label="Contrôle des Cas"
                        active={activeTab === "cases"}
                        onClick={() => setActiveTab("cases")}
                    />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl mb-4 relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Users size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {isEditingDoc ? (
                                <form
                                    onSubmit={saveDoctorName}
                                    className="flex flex-col"
                                >
                                    <input
                                        autoFocus
                                        className="text-xs border rounded px-1 outline-none font-bold bg-white"
                                        value={doctorName}
                                        onChange={(e) =>
                                            setDoctorName(e.target.value)
                                        }
                                        onBlur={saveDoctorName}
                                    />
                                    <p className="text-[10px] text-gray-400 italic">
                                        Appuyez sur Entrée
                                    </p>
                                </form>
                            ) : (
                                <div
                                    onClick={() => setIsEditingDoc(true)}
                                    className="cursor-pointer group"
                                >
                                    <p className="text-sm font-semibold truncate group-hover:text-blue-600 flex items-center gap-1">
                                        {doctorName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Admin RDC
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors w-full px-2">
                        <LogOut size={18} />{" "}
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl w-96">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un ID..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>
                    <button
                        onClick={() => setActiveTab("alerts")}
                        className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-all"
                    >
                        <Plus size={18} /> Nouvelle Alerte
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {activeTab === "dashboard" && (
                        <DashboardView
                            setActiveTab={setActiveTab}
                            users={users}
                            reports={reports}
                            doctorName={doctorName}
                        />
                    )}
                    {activeTab === "map" && <MapView />}
                    {activeTab === "alerts" && <AlertsView />}
                    {activeTab === "cases" && (
                        <CasesView users={users} refresh={fetchData} />
                    )}
                </main>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// VIEWS
// ---------------------------------------------------------

function DashboardView({ setActiveTab, users, reports, doctorName }) {
    const stats = [
        {
            label: "Cas confirmés",
            value: users.filter((u) => u.status === "danger").length,
            color: "text-red-600",
            icon: ShieldAlert,
        },
        {
            label: "Alertes",
            value: users.filter((u) => u.status === "warning").length,
            color: "text-orange-500",
            icon: Bell,
        },
        {
            label: "Utilisateurs",
            value: users.length,
            color: "text-blue-600",
            icon: Users,
        },
        {
            label: "Zones RDC",
            value: "85%",
            color: "text-green-600",
            icon: Activity,
        },
    ];
    return (
        <>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Bienvenue, {doctorName}
                </h2>
                <p className="text-gray-500">
                    Situation épidémique en temps réel.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <div
                            className={`p-3 w-fit rounded-xl bg-gray-50 ${s.color} mb-4`}
                        >
                            <s.icon size={24} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">
                            {s.label}
                        </h3>
                        <p className="text-2xl font-bold">{s.value}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[450px]">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold">Aperçu de la map</h3>
                        <button
                            onClick={() => setActiveTab("map")}
                            className="text-xs text-blue-600 font-bold flex items-center gap-1 uppercase"
                        >
                            Voir carte <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <MapContainer
                            center={[-4.3224, 15.307]}
                            zoom={11}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        </MapContainer>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto h-[450px]">
                    <h3 className="font-bold mb-6">Alertes Récentes</h3>
                    <div className="space-y-6">
                        {reports.map((r, i) => (
                            <ActivityItem
                                key={i}
                                type={r.risk_level}
                                title={`Test ${r.risk_level}`}
                                desc={`ID: ${r.user_id}`}
                                time={new Date(
                                    r.created_at,
                                ).toLocaleTimeString()}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function MapView() {
    // La persistence localStorage est maintenant gérée directement via le bouton "Enregistrer les modifications"
    // qui affiche: console.log("📤 Données à exporter:", payload)
    // L'utilisateur peut le copier et l'envoyer au backend

    return (
        <div className="h-full">
            <GeoMap />
        </div>
    );
}

function AlertsView() {
    const [msg, setMsg] = useState("");
    const [type, setType] = useState("info");
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Diffuser une Alerte</h2>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setType("danger")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${type === "danger" ? "border-red-500 bg-red-50 text-red-600" : "border-gray-100 text-gray-400"}`}
                >
                    Urgence
                </button>
                <button
                    onClick={() => setType("info")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${type === "info" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"}`}
                >
                    Information
                </button>
            </div>
            <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows="5"
                className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6 outline-none focus:border-black"
                placeholder="Message..."
            ></textarea>
            <button
                onClick={async () => {
                    await supabase
                        .from("broadcasts")
                        .insert({ message: msg, type });
                    setMsg("");
                    alert("Diffusé !");
                }}
                className="w-full bg-black text-white py-4 rounded-xl font-bold"
            >
                DIFFUSER MAINTENANT
            </button>
        </div>
    );
}

function CasesView({ users, refresh }) {
    async function declare(id) {
        if (!confirm("Déclarer POSITIF ?")) return;
        await supabase.from("users").update({ status: "danger" }).eq("id", id);
        const { data } = await supabase
            .from("contacts_exchange")
            .select("*")
            .or(`user_id.eq.${id},contact_id.eq.${id}`);
        if (data) {
            for (const c of data) {
                const targetId = c.user_id === id ? c.contact_id : c.user_id;
                await supabase.from("broadcasts").insert({
                    type: "danger",
                    message: `ALERTE TRAÇAGE : Contact prolongé avec un cas confirmé.`,
                });
            }
        }
        refresh();
    }
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                            Utilisateur
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                            Diagnostic
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                        <tr
                            key={u.id}
                            className="hover:bg-gray-50 transition-all"
                        >
                            <td className="px-6 py-4 flex items-center gap-3">
                                <div className="bg-blue-50 text-blue-600 font-mono font-bold text-xs px-2 py-1 rounded-lg">
                                    {u.id}
                                </div>
                                <p className="font-medium text-gray-700">
                                    {u.name}
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.status === "danger" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                                >
                                    {u.status === "danger" ? "POSITIF" : "SAIN"}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {u.status !== "danger" && (
                                    <button
                                        onClick={() => declare(u.id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                                    >
                                        DÉCLARER POSITIF
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// HELPERS
function NavItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
        >
            {icon}
            {label}
        </button>
    );
}
function ActivityItem({ type, title, desc, time }) {
    const colors = {
        danger: "bg-red-500",
        warning: "bg-orange-500",
        safe: "bg-green-500",
        info: "bg-blue-500",
    };
    return (
        <div className="flex gap-4">
            <div
                className={`w-1 h-10 rounded-full ${colors[type] || "bg-gray-300"}`}
            />
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold">{title}</h4>
                    <p className="text-[10px] text-gray-400">{time}</p>
                </div>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
    );
}

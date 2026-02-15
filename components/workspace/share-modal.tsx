"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mail,
    UserPlus,
    Crown,
    Shield,
    User,
    Eye,
    MoreVertical,
    Trash2,
    Check,
    Copy,
} from "lucide-react";

interface Member {
    id: string;
    role: string;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

interface ShareModalProps {
    workspaceId: string;
    workspaceName: string;
    currentUserId: string;
    onClose: () => void;
}

const ROLE_INFO = {
    owner: {
        label: "Owner",
        icon: Crown,
        description: "Full access & can delete workspace",
        color: "text-yellow-600 dark:text-yellow-400",
    },
    admin: {
        label: "Admin",
        icon: Shield,
        description: "Can manage members & settings",
        color: "text-purple-600 dark:text-purple-400",
    },
    member: {
        label: "Member",
        icon: User,
        description: "Can create & edit pages",
        color: "text-blue-600 dark:text-blue-400",
    },
    viewer: {
        label: "Viewer",
        icon: Eye,
        description: "Can only view pages",
        color: "text-gray-600 dark:text-gray-400",
    },
};

export function ShareModal({
    workspaceId,
    workspaceName,
    currentUserId,
    onClose,
}: ShareModalProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [email, setEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState("member");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [showRoleMenu, setShowRoleMenu] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await fetch(`/api/invites?workspaceId=${workspaceId}`);
                const data = await res.json();
                setMembers(data.members || []);
            } catch (error) {
                console.error("Error fetching members:", error)
            }
        }
        fetchMembers();
    }, [workspaceId]);

    const currentUserRole = members.find((m) => m.user.id === currentUserId)?.role;
    const canInvite = ["owner", "admin"].includes(currentUserRole || "");

    async function handleInvite() {
        if (!email || !canInvite) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/invites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId,
                    email,
                    role: selectedRole,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to invite member");
                return;
            }

            setMembers((prev) => [...prev, data.member]);
            setEmail("");
            setError("");
        } catch (error) {
            setError("Failed to invite member");
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(userId: string) {
        if (!canInvite) return;

        try {
            await fetch(`/api/invites?workspaceId=${workspaceId}&userId=${userId}`, {
                method: "DELETE",
            });

            setMembers((prev) => prev.filter((m) => m.user.id !== userId));
        } catch (error) {
            console.error("Error removing member:", error);
        }
    }

    async function handleUpdateRole(userId: string, newRole: string) {
        if (currentUserRole !== "owner") return;

        try {
            const res = await fetch("/api/invites", {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId,
                    userId,
                    role: newRole,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setMembers((prev) =>
                    prev.map((m) => (m.user.id === userId ? data.member : m))
                );
                setShowRoleMenu(null);
            }
        } catch (error) {
            console.error("Error updating role:", error);
        }
    }

    function handleCopyLink() {
        const link = `${window.location.origin}/workspace/${workspaceId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Share "{workspaceName}"
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Invite team members to collaborate on this workspace
                    </p>
                </div>

                {/* Invite Form */}
                {canInvite && (
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                                        placeholder="Enter email address..."
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="viewer">Viewer</option>
                            </select>

                            <button
                                onClick={handleInvite}
                                disabled={!email || loading}
                                className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" />
                                Invite
                            </button>
                        </div>

                        {error && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}
                    </div>
                )}

                {/* Copy Link */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl font-mono text-sm text-gray-700 dark:text-gray-300 truncate">
                            {`${window.location.origin}/workspace/${workspaceId}`}
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5 text-green-600" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    Copy Link
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Members List */}
                <div className="p-6 overflow-y-auto max-h-96">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                        Members ({members.length})
                    </h3>

                    <div className="space-y-2">
                        {members.map((member) => {
                            const roleInfo = ROLE_INFO[member.role as keyof typeof ROLE_INFO];
                            const RoleIcon = roleInfo.icon;
                            const isCurrentUser = member.user.id === currentUserId;
                            const canModify = canInvite && !isCurrentUser && member.role !== "owner";

                            return (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors group"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                        {member.user.image ? (
                                            <img
                                                src={member.user.image}
                                                alt={member.user.name || ""}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            member.user.name?.charAt(0).toUpperCase() || "?"
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {member.user.name}
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                        (You)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {member.user.email}
                                        </p>
                                    </div>

                                    {/* Role Badge */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                canModify
                                                    ? setShowRoleMenu(
                                                        showRoleMenu === member.id ? null : member.id
                                                    )
                                                    : null
                                            }
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${roleInfo.color} bg-opacity-10 ${canModify ? "hover:bg-opacity-20 cursor-pointer" : ""
                                                }`}
                                        >
                                            <RoleIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{roleInfo.label}</span>
                                            {canModify && <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100" />}
                                        </button>

                                        {/* Role Menu */}
                                        <AnimatePresence>
                                            {showRoleMenu === member.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-slate-600 z-50 overflow-hidden"
                                                >
                                                    {Object.entries(ROLE_INFO)
                                                        .filter(([role]) => role !== "owner")
                                                        .map(([role, info]) => {
                                                            const Icon = info.icon;
                                                            return (
                                                                <button
                                                                    key={role}
                                                                    onClick={() => handleUpdateRole(member.user.id, role)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-left"
                                                                >
                                                                    <Icon className={`w-4 h-4 ${info.color}`} />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {info.label}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {info.description}
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    <div className="border-t border-gray-200 dark:border-slate-600">
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("Remove this member?")) {
                                                                    handleRemove(member.user.id);
                                                                }
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Remove</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
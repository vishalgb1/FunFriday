import { useState } from 'react'
import { useStore } from '../store'
import Avatar from './Avatar'
 
const ROLE_KEYS = ['Admin', 'Host', 'Lead', 'Member', 'New']
 
const ROLE_STYLE = {
  Admin:  { bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800/50', icon: 'bg-purple-100 dark:bg-purple-900', badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' },
  Host:   { bg: 'bg-teal-50   dark:bg-teal-950/40',   border: 'border-teal-200   dark:border-teal-800/50',   icon: 'bg-teal-100   dark:bg-teal-900',   badge: 'bg-teal-100   dark:bg-teal-900/60   text-teal-700   dark:text-teal-300'   },
  Lead:   { bg: 'bg-blue-50   dark:bg-blue-950/40',   border: 'border-blue-200   dark:border-blue-800/50',   icon: 'bg-blue-100   dark:bg-blue-900',   badge: 'bg-blue-100   dark:bg-blue-900/60   text-blue-700   dark:text-blue-300'   },
  Member: { bg: 'bg-stone-50  dark:bg-white/3',       border: 'border-stone-200  dark:border-white/8',       icon: 'bg-stone-100  dark:bg-white/10',   badge: 'bg-stone-100  dark:bg-white/10       text-stone-600  dark:text-stone-400'   },
  New:    { bg: 'bg-green-50  dark:bg-green-950/40',  border: 'border-green-200  dark:border-green-800/50',  icon: 'bg-green-100  dark:bg-green-900',  badge: 'bg-green-100  dark:bg-green-900/60  text-green-700  dark:text-green-300'  },
}
 
export default function RolesView() {
  const { roles, members, updateMemberRole } = useStore()
  const [expandedRole, setExpandedRole] = useState(null)
 
  // Group members by their role
  const byRole = ROLE_KEYS.reduce((acc, key) => {
    acc[key] = members.filter((m) => m.role === key)
    return acc
  }, {})
 
  return (
    <div className="space-y-6">
 
      {/* Role assignment section */}
      <div>
        <div className="mb-4">
          <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">Role Assignments</h2>
          <p className="text-sm text-stone-400 mt-1">Click a role to expand and reassign members</p>
        </div>
 
        <div className="space-y-2">
          {roles.map((role) => {
            const s = ROLE_STYLE[role.key] ?? ROLE_STYLE.Member
            const roleMembers = byRole[role.key] ?? []
            const isOpen = expandedRole === role.key
 
            return (
              <div key={role.key} className={`rounded-2xl border overflow-hidden transition-all ${s.bg} ${s.border}`}>
                {/* Role header — clickable */}
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                  onClick={() => setExpandedRole(isOpen ? null : role.key)}
                  aria-expanded={isOpen}
                >
                  <div className={`w-9 h-9 rounded-xl ${s.icon} flex items-center justify-center text-lg shrink-0`}>
                    {role.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">{role.label}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{role.desc}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${s.badge}`}>
                    {roleMembers.length}
                  </span>
                  <span className="text-stone-400 text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
                </button>
 
                {/* Members with this role */}
                {isOpen && (
                  <div className="border-t border-current/10 px-5 pb-4 pt-3 space-y-2">
                    {roleMembers.length === 0 ? (
                      <p className="text-xs text-stone-400 py-1">No members assigned to this role yet.</p>
                    ) : (
                      roleMembers.map((m) => (
                        <MemberRoleRow
                          key={m.id}
                          member={m}
                          roles={roles}
                          onChangeRole={(newRole) => updateMemberRole(m.id, newRole)}
                        />
                      ))
                    )}
 
                    {/* Quick assign unassigned members to this role */}
                    {members.filter((m) => m.role !== role.key).length > 0 && (
                      <div className="pt-2 border-t border-current/10">
                        <p className="text-xs text-stone-400 mb-2 font-medium">Move a member here:</p>
                        <div className="flex flex-wrap gap-2">
                          {members.filter((m) => m.role !== role.key).map((m) => (
                            <button
                              key={m.id}
                              onClick={() => updateMemberRole(m.id, role.key)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-black/20 border border-current/10 text-xs text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-black/40 transition-colors"
                            >
                              <Avatar initials={m.initials} avatarKey={m.avatarKey} size="xs" />
                              {m.name.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
 
function MemberRoleRow({ member, roles, onChangeRole }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={member.initials} avatarKey={member.avatarKey} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200 truncate">{member.name}</p>
        {member.note && <p className="text-xs text-stone-400 truncate">{member.note}</p>}
      </div>
      <select
        value={member.role}
        onChange={(e) => onChangeRole(e.target.value)}
        aria-label={`Change role for ${member.name}`}
        className="text-xs rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-1 outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
      >
        {roles.map((r) => (
          <option key={r.key} value={r.key}>{r.emoji} {r.label}</option>
        ))}
      </select>
    </div>
  )
}
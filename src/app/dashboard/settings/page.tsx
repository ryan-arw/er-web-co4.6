'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Lock, Bell, Shield, Globe,
    Save, Eye, EyeOff, Loader2, Check, ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    const [email, setEmail] = useState('');

    // Password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSaved, setPasswordSaved] = useState(false);

    // Notifications
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [promotions, setPromotion] = useState(false);
    const [reminderNotifs, setReminderNotifs] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || '');
                setFullName(user.user_metadata?.full_name || '');
                setPhone(user.user_metadata?.phone || '');

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profile) {
                    if (profile.name) setFullName(profile.name);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase.auth.updateUser({
                data: { full_name: fullName, phone }
            });

            await supabase
                .from('profiles')
                .update({ name: fullName, updated_at: new Date().toISOString() })
                .eq('id', user.id);
        }

        setSavingProfile(false);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        if (newPassword.length < 6) {
            setPasswordError('密码至少需要 6 个字符。');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('两次输入的密码不一致。');
            return;
        }
        setSavingPassword(true);
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setSavingPassword(false);
        if (error) {
            setPasswordError(error.message);
        } else {
            setPasswordSaved(true);
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordSaved(false), 3000);
        }
    };

    const handleDeleteAccount = () => {
        if (confirm('确认删除您的账户吗？此操作不可撤销，您的所有数据将被永久删除。')) {
            // Future: implement account deletion
            alert('请联系客服完成账户删除。');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-morning-green animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">账户设置</h1>
                <p className="text-sm text-text-muted mt-1">管理您的个人信息和偏好</p>
            </div>

            {/* Profile Section */}
            <div className="p-6 rounded-2xl bg-white border border-border-soft">
                <h2 className="text-base font-bold text-herbal-green mb-5 flex items-center gap-2">
                    <User size={18} /> 个人信息
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-text-muted mb-1.5 block uppercase tracking-wider">注册邮箱</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-border-soft text-sm text-text-muted cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">姓名 / 昵称</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="您的姓名"
                            className="w-full px-4 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-herbal-green mb-1.5 block">手机号码</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+60 12-345 6789"
                            className="w-full px-4 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2 disabled:opacity-60"
                    >
                        {savingProfile ? <Loader2 size={16} className="animate-spin" /> : profileSaved ? <><Check size={16} /> 已保存</> : <><Save size={16} /> 保存信息</>}
                    </button>
                </form>
            </div>

            {/* Password Section */}
            <div className="p-6 rounded-2xl bg-white border border-border-soft">
                <h2 className="text-base font-bold text-herbal-green mb-5 flex items-center gap-2">
                    <Lock size={18} /> 修改密码
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {passwordError && (
                        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{passwordError}</div>
                    )}
                    {passwordSaved && (
                        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-600">密码已成功更新！</div>
                    )}
                    <div>
                        <label className="text-xs font-medium text-herbal-green mb-1.5 block">新密码</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="至少 6 个字符"
                                className="w-full px-4 pr-12 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-herbal-green">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-herbal-green mb-1.5 block">确认密码</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="再次输入新密码"
                            className="w-full px-4 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={savingPassword}
                        className="bg-herbal-green text-white text-sm font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-herbal-green-dark transition-colors disabled:opacity-60"
                    >
                        {savingPassword ? <Loader2 size={16} className="animate-spin" /> : '更新密码'}
                    </button>
                </form>
            </div>

            {/* Notifications */}
            <div className="p-6 rounded-2xl bg-white border border-border-soft">
                <h2 className="text-base font-bold text-herbal-green mb-5 flex items-center gap-2">
                    <Bell size={18} /> 通知偏好
                </h2>
                <div className="space-y-4">
                    {[
                        { label: '邮件通知', desc: '接收账户相关的重要邮件通知', value: emailNotifs, setter: setEmailNotifs },
                        { label: '订单更新', desc: '当订单状态发生变化时通知我', value: orderUpdates, setter: setOrderUpdates },
                        { label: 'ReSet 提醒', desc: '每季度提醒我进行节律校准', value: reminderNotifs, setter: setReminderNotifs },
                        { label: '促销信息', desc: '接收优惠活动和新品推送', value: promotions, setter: setPromotion },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-herbal-green">{item.label}</p>
                                <p className="text-xs text-text-muted">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => item.setter(!item.value)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-warm-orange' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.value ? 'translate-x-5' : ''
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Language */}
            <div className="p-6 rounded-2xl bg-white border border-border-soft">
                <h2 className="text-base font-bold text-herbal-green mb-5 flex items-center gap-2">
                    <Globe size={18} /> 语言偏好
                </h2>
                <select className="px-4 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all">
                    <option value="zh">简体中文</option>
                    <option value="en">English</option>
                    <option value="ms">Bahasa Melayu</option>
                </select>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
                <h2 className="text-base font-bold text-red-600 mb-3 flex items-center gap-2">
                    <Shield size={18} /> 危险区域
                </h2>
                <p className="text-xs text-red-500 mb-4">删除账户后，您的所有数据将被永久清除且不可恢复。</p>
                <button
                    onClick={handleDeleteAccount}
                    className="px-5 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                    删除我的账户
                </button>
            </div>
        </div>
    );
}

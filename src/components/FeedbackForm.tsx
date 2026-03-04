'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, Loader2, AlertCircle, Camera, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const FEEDBACK_TYPES = [
    { id: 'bug_report', label: 'Bug Report', icon: '🐛' },
    { id: 'feature_request', label: 'Feature Request', icon: '💡' },
    { id: 'complaint', label: 'Complaint', icon: '📢' },
    { id: 'other', label: 'Other', icon: '📝' },
];

const MAX_FILES = 3;

// Image compression utility
const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        // Only compress images
        if (!file.type.startsWith('image/')) {
            return resolve(file);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if too large
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas toBlob failed'));
                }, 'image/jpeg', quality);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export default function FeedbackForm() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        screenshotUrls: [] as string[],
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isUploading, setIsUploading] = useState(false);
    const [refNumber, setRefNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check if we already have too many files
        const currentCount = formData.screenshotUrls.length;
        const remaining = MAX_FILES - currentCount;

        if (remaining <= 0) {
            alert(`You can only upload up to ${MAX_FILES} images.`);
            return;
        }

        const filesToUpload = files.slice(0, remaining);
        setIsUploading(true);
        const supabase = createClient();

        try {
            const uploadPromises = filesToUpload.map(async (file) => {
                // 1. Compress image
                const compressedBlob = await compressImage(file);

                // 2. Prepare file metadata
                const fileExt = 'jpg'; // We compress to jpeg
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `feedback/${fileName}`;

                // 3. Upload to Supabase
                const { error: uploadError } = await supabase.storage
                    .from('feedback-screenshots')
                    .upload(filePath, compressedBlob, {
                        contentType: 'image/jpeg'
                    });

                if (uploadError) throw uploadError;

                // 4. Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('feedback-screenshots')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const newUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                screenshotUrls: [...prev.screenshotUrls, ...newUrls]
            }));

            // Show message if some files were skipped
            if (files.length > remaining) {
                alert(`Limit of ${MAX_FILES} images reached. Some images were not uploaded.`);
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            alert('Failed to upload one or more images');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeScreenshot = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            screenshotUrls: prev.screenshotUrls.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    metadata: {
                        userAgent: navigator.userAgent,
                        url: window.location.href,
                    }
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');

            setRefNumber(data.referenceNumber);
            setStatus('success');
            setFormData({ type: '', description: '', screenshotUrls: [] });
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message);
            setStatus('error');
        }
    };

    if (!mounted) return null;

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-morning-green/30 p-8 rounded-3xl text-center shadow-xl shadow-morning-green/5 max-w-xl mx-auto"
            >
                <div className="w-20 h-20 bg-morning-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-morning-green-dark" />
                </div>
                <h3 className="text-2xl font-bold text-herbal-green mb-2">Feedback Received!</h3>
                <p className="text-text-sub mb-6">
                    Thank you for your valuable feedback. Our team will review it as part of our continuous improvement process.
                </p>
                <div className="bg-ivory py-3 px-4 rounded-xl inline-block border border-border-soft mb-8">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Reference Number</p>
                    <p className="text-lg font-mono font-bold text-herbal-green tracking-tight">{refNumber}</p>
                </div>
                <div>
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-warm-orange font-semibold hover:underline"
                    >
                        Submit more feedback
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div id="feedback-form" className="bg-white border border-border-soft p-8 rounded-3xl shadow-xl shadow-herbal-green/5 max-w-2xl mx-auto">
            <div className="mb-6 p-4 rounded-xl bg-warm-orange/5 border border-warm-orange/20 flex gap-3">
                <AlertCircle size={20} className="text-warm-orange flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-sub leading-relaxed">
                    <strong>Note:</strong> This is a one-way feedback channel. You will <strong>not</strong> receive a reply.
                    For urgent issues or order assistance, please use the <button type="button" onClick={() => {
                        const contactTab = document.querySelector('[data-tab="contact"]') as HTMLElement | null;
                        if (contactTab) contactTab.click();
                        else window.location.hash = 'contact-form'; // Fallback
                    }} className="text-warm-orange font-bold underline">Contact Form</button> instead.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-herbal-green ml-1">Feedback Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {FEEDBACK_TYPES.map(type => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: type.id })}
                                className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 ${formData.type === type.id
                                        ? 'border-warm-orange bg-warm-orange/5 ring-1 ring-warm-orange shadow-sm'
                                        : 'border-border-soft hover:border-morning-green/50 bg-white'
                                    }`}
                            >
                                <span className="text-xl">{type.icon}</span>
                                <span className="text-[10px] font-bold text-herbal-green uppercase tracking-tighter leading-none">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-herbal-green ml-1">Your Message</label>
                    <textarea
                        rows={5}
                        required
                        placeholder="Tell us what's on your mind..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl border border-border-soft outline-none focus:ring-2 focus:ring-morning-green transition-all placeholder:text-text-muted/50 resize-none"
                    />
                </div>

                {/* Screenshot Upload with Multi-support */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-herbal-green ml-1 flex justify-between items-center">
                        Attach Screenshots (Optional)
                        <span className="text-[10px] text-text-muted uppercase font-bold">Max {MAX_FILES} images</span>
                    </label>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {/* Display existing screenshots */}
                        {formData.screenshotUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square group">
                                <img
                                    src={url}
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-full h-full object-cover rounded-2xl border border-border-soft shadow-sm group-hover:opacity-90 transition-opacity"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeScreenshot(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors z-20"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {/* Add Button if limit not reached */}
                        {formData.screenshotUrls.length < MAX_FILES && (
                            <div className="relative aspect-square">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    disabled={isUploading}
                                />
                                <div className={`w-full h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${isUploading ? 'bg-ivory border-border-soft' : 'border-border-soft hover:border-morning-green/50 hover:bg-morning-green/5'
                                    }`}>
                                    {isUploading ? (
                                        <Loader2 size={24} className="text-morning-green animate-spin" />
                                    ) : (
                                        <>
                                            <div className="p-2 bg-morning-green/10 rounded-full text-morning-green-dark">
                                                <Plus size={20} />
                                            </div>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Add Image</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 flex items-center gap-2 text-sm">
                        <AlertCircle size={18} />
                        <p>{errorMessage}</p>
                    </div>
                )}

                <button
                    disabled={status === 'loading' || isUploading}
                    type="submit"
                    className="w-full py-4 rounded-xl bg-warm-orange text-white font-bold text-lg shadow-lg shadow-warm-orange/20 hover:bg-warm-orange-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Submit Feedback
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

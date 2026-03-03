'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, CreditCard, Shield,
    Lock, Loader2, MapPin, Truck, Package,
    User, ChevronDown, CheckCircle2, Info
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/marketing/Navbar';
import { createClient } from '@/lib/supabase/client';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Address {
    id: string;
    label: string;
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}

export default function CheckoutPage() {
    const { items, totalPrice, pricePerBox, totalBoxes, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState<'info' | 'payment'>('info');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');
    const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paypal'>('stripe');

    // Guest Registration
    const [guestRegister, setGuestRegister] = useState(true);
    const [password, setPassword] = useState('');

    // Shipping info
    const [shippingInfo, setShippingInfo] = useState({
        name: '', email: '', phone: '',
        line1: '', line2: '', city: '', state: '', zip: '', country: 'United States',
    });

    const supabase = createClient();

    // 1. Initial Load: Check Auth and Fetch Addresses
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setShippingInfo(prev => ({ ...prev, email: user.email || '' }));
                fetchAddresses(user.id, user.email);
            }
        };
        checkUser();
    }, []);

    const fetchAddresses = async (userId: string, userEmail?: string) => {
        const { data } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });

        if (data) {
            const mappedAddresses = data.map(a => ({
                id: a.id,
                label: a.name || 'Address',
                name: a.name || '',
                phone: a.phone || '',
                line1: a.line1,
                line2: a.line2,
                city: a.city,
                state: a.state,
                zip: a.postal_code,
                country: a.country,
                isDefault: a.is_default
            }));
            setAddresses(mappedAddresses);

            // Auto-select default address
            const defaultAddr = mappedAddresses.find(a => a.isDefault);
            if (defaultAddr) {
                applyAddress(defaultAddr, userEmail);
            }
        }
    };

    const applyAddress = (addr: Address, explicitEmail?: string) => {
        setShippingInfo(prev => ({
            ...prev,
            name: addr.name,
            email: explicitEmail || prev.email || '',
            phone: addr.phone,
            line1: addr.line1,
            line2: addr.line2 || '',
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
            country: addr.country,
        }));
        setSelectedAddressId(addr.id);
    };

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    // 2. Stripe Checkout Integration
    const handleStripePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingInfo,
                    guestRegister,
                    password: guestRegister ? password : null
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to initialize payment');
            }
        } catch (error) {
            console.error('Stripe redirect error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // 3. PayPal Integration Helpers
    const createPayPalOrder = async () => {
        try {
            const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, shippingInfo }),
            });

            const order = await response.json();
            return order.id;
        } catch (err) {
            console.error("PayPal create order error:", err);
            throw err;
        }
    };

    const onPayPalApprove = async (data: { orderID: string }) => {
        try {
            const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
            });

            const captureData = await response.json();
            if (captureData.status === "COMPLETED") {
                clearCart();
                router.push(`/checkout/success?paypal_order_id=${data.orderID}`);
            }
        } catch (err) {
            console.error("PayPal capture error:", err);
            alert("Payment capture failed. Please contact support.");
        }
    };

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center pt-20">
                    <div className="text-center">
                        <Package size={48} className="text-text-muted/20 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-herbal-green mb-3">Your cart is empty</h2>
                        <Link href="/products" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
                            Browse Products <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen bg-ivory/30">
                <div className="max-w-5xl mx-auto px-6 md:px-8">
                    {/* Header with Login Suggestion */}
                    {!user && (
                        <div className="mb-8 p-4 rounded-2xl bg-white border border-border-soft flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-morning-green/10 flex items-center justify-center text-morning-green-dark">
                                    <User size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-herbal-green">Already have an account?</p>
                                    <p className="text-text-muted">Sign in to use your saved addresses.</p>
                                </div>
                            </div>
                            <Link href="/login" className="text-sm font-bold text-warm-orange hover:underline px-4 py-2">
                                Sign In
                            </Link>
                        </div>
                    )}

                    {/* Steps Indicator */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className={`flex items-center gap-2 ${step === 'info' ? 'text-warm-orange' : 'text-morning-green-dark'}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'info' ? 'bg-warm-orange text-white' : 'bg-morning-green text-white'
                                }`}>1</span>
                            <span className="text-sm font-semibold">Shipping</span>
                        </div>
                        <div className="flex-1 h-px bg-border-soft" />
                        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-warm-orange' : 'text-text-muted'}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-warm-orange text-white' : 'bg-gray-200 text-text-muted'
                                }`}>2</span>
                            <span className="text-sm font-semibold">Payment</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Area */}
                        <div className="lg:col-span-2">
                            {step === 'info' ? (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-herbal-green flex items-center gap-2">
                                            <MapPin size={20} /> Shipping Details
                                        </h2>
                                    </div>

                                    {/* Address Selector for User */}
                                    {user && addresses.length > 0 && (
                                        <div className="mb-6 space-y-3">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Saved Address</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {addresses.map(addr => (
                                                    <button
                                                        key={addr.id}
                                                        type="button"
                                                        onClick={() => applyAddress(addr)}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedAddressId === addr.id ? 'border-warm-orange bg-warm-orange/5' : 'border-border-soft bg-white'}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-herbal-green">{addr.label}</span>
                                                            {selectedAddressId === addr.id && <CheckCircle2 size={16} className="text-warm-orange" />}
                                                        </div>
                                                        <p className="text-xs text-text-muted mt-1 truncate">{addr.line1}, {addr.city}</p>
                                                    </button>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedAddressId('new')}
                                                    className={`p-4 rounded-xl border-2 border-dashed text-left transition-all ${selectedAddressId === 'new' ? 'border-morning-green bg-morning-green/5' : 'border-border-soft hover:border-morning-green/50'}`}
                                                >
                                                    <span className="text-sm font-bold text-herbal-green">Enter New Address</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleInfoSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">Full Name *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.name}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                                    className="input-base"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">Phone *</label>
                                                <input
                                                    type="tel" required
                                                    value={shippingInfo.phone}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                                    placeholder="+1 (123) 456-7890"
                                                    className="input-base"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">Email Address *</label>
                                            <input
                                                type="email" required
                                                disabled={!!user}
                                                value={shippingInfo.email}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                                placeholder="you@example.com"
                                                className={`input-base ${user ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                                            />
                                        </div>

                                        {/* Guest Register Checkbox */}
                                        {!user && (
                                            <div className="p-4 rounded-2xl bg-morning-green/5 border border-morning-green/20 space-y-4">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={guestRegister}
                                                        onChange={(e) => setGuestRegister(e.target.checked)}
                                                        className="w-4 h-4 rounded-md border-border-soft text-warm-orange focus:ring-warm-orange"
                                                    />
                                                    <span className="text-sm font-semibold text-herbal-green">Create an account for faster checkout next time</span>
                                                </label>
                                                <AnimatePresence>
                                                    {guestRegister && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">Create Password</label>
                                                            <input
                                                                type="password"
                                                                required={guestRegister}
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                placeholder="At least 6 characters"
                                                                className="input-base"
                                                            />
                                                            <p className="text-[10px] text-text-muted mt-2 flex items-center gap-1">
                                                                <Info size={10} /> Your account will be created upon successful payment.
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">Street Address *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.line1}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, line1: e.target.value })}
                                                    placeholder="123 Main St"
                                                    className="input-base"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">Apt, Suite, etc. (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={shippingInfo.line2}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, line2: e.target.value })}
                                                    placeholder="Unit 1A"
                                                    className="input-base"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">City *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.city}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                                    className="input-base"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">State / Region *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.state}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                                    placeholder="CA"
                                                    className="input-base"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">ZIP / Postal *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.zip}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                                                    className="input-base"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-herbal-green mb-1.5 block uppercase tracking-wider">Country *</label>
                                            <select
                                                required
                                                value={shippingInfo.country}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                                className="input-base cursor-pointer"
                                            >
                                                <option value="United States">United States</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Singapore">Singapore</option>
                                            </select>
                                        </div>

                                        <button type="submit" className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 mt-6">
                                            Continue to Payment <ArrowRight size={16} />
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <button onClick={() => setStep('info')} className="text-sm text-herbal-green hover:text-warm-orange flex items-center gap-1 mb-6 transition-colors font-bold uppercase tracking-widest">
                                        <ArrowLeft size={16} /> Back to Shipping
                                    </button>

                                    <h2 className="text-xl font-bold text-herbal-green mb-6 flex items-center gap-2">
                                        <CreditCard size={20} /> Payment Method
                                    </h2>

                                    {/* Shipping Summary */}
                                    <div className="p-4 rounded-xl bg-white border border-border-soft mb-8">
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Ship to</p>
                                        <p className="text-sm text-herbal-green font-bold">{shippingInfo.name}</p>
                                        <p className="text-xs text-text-sub mt-0.5">{shippingInfo.line1}{shippingInfo.line2 ? `, ${shippingInfo.line2}` : ''}</p>
                                        <p className="text-xs text-text-sub">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}, {shippingInfo.country}</p>
                                    </div>

                                    {/* Provider Tabs */}
                                    <div className="grid grid-cols-2 gap-3 mb-8">
                                        <button
                                            onClick={() => setPaymentProvider('stripe')}
                                            className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentProvider === 'stripe' ? 'border-warm-orange bg-warm-orange/5 shadow-inner' : 'border-border-soft bg-white hover:border-warm-orange/30'}`}
                                        >
                                            <Lock size={16} className={paymentProvider === 'stripe' ? 'text-warm-orange' : 'text-text-muted'} />
                                            <span className="text-sm font-bold text-herbal-green">Credit Card</span>
                                            <div className="flex gap-1">
                                                <div className="w-6 h-4 bg-blue-800 rounded-sm" />
                                                <div className="w-6 h-4 bg-amber-600 rounded-sm" />
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setPaymentProvider('paypal')}
                                            className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentProvider === 'paypal' ? 'border-[#0070ba] bg-blue-50/50 shadow-inner' : 'border-border-soft bg-white hover:border-blue-300'}`}
                                        >
                                            <Lock size={16} className={paymentProvider === 'paypal' ? 'text-[#0070ba]' : 'text-text-muted'} />
                                            <span className="text-sm font-bold text-herbal-green">PayPal</span>
                                            <span className="text-[10px] font-black text-blue-700 italic">PayPal</span>
                                        </button>
                                    </div>

                                    {/* Stripe Redirect Flow */}
                                    {paymentProvider === 'stripe' && (
                                        <div className="space-y-6">
                                            <div className="p-6 rounded-2xl bg-white border border-border-soft text-center">
                                                <Shield size={32} className="text-morning-green mx-auto mb-3" />
                                                <h3 className="text-sm font-bold text-herbal-green">Secure Checkout by Stripe</h3>
                                                <p className="text-xs text-text-muted mt-2 max-w-xs mx-auto">
                                                    You will be redirected to Stripe to securely complete your payment. We do not store your card details.
                                                </p>
                                            </div>

                                            <button
                                                onClick={handleStripePayment}
                                                disabled={loading}
                                                className="w-full btn-primary text-sm py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-warm-orange/20"
                                            >
                                                {loading ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Preparing...</>
                                                ) : (
                                                    <>Pay with Card · ${totalPrice.toFixed(2)} <ArrowRight size={14} /></>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* PayPal Button Flow */}
                                    {paymentProvider === 'paypal' && (
                                        <div className="space-y-6 p-6 rounded-2xl bg-white border border-border-soft">
                                            <PayPalScriptProvider options={{
                                                "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                                                currency: "USD",
                                                intent: "capture"
                                            }}>
                                                <PayPalButtons
                                                    style={{ layout: "vertical", shape: "pill", label: "pay" }}
                                                    createOrder={createPayPalOrder}
                                                    onApprove={onPayPalApprove}
                                                />
                                            </PayPalScriptProvider>
                                            <p className="text-center text-[10px] text-text-muted">
                                                Secure transaction via PayPal encrypted processing.
                                            </p>
                                        </div>
                                    )}

                                    {/* Security Footer */}
                                    <div className="flex items-center justify-center gap-6 mt-10 text-text-muted border-t border-border-soft pt-8">
                                        <div className="flex flex-col items-center gap-1">
                                            <Shield size={16} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Secure SSL</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Lock size={16} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Encrypted</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <CheckCircle2 size={16} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Certified</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="p-6 rounded-3xl bg-white border border-border-soft sticky top-28 shadow-sm">
                                <h3 className="text-sm font-bold text-herbal-green mb-6 uppercase tracking-widest">Order Summary</h3>

                                <div className="space-y-4 pb-6 border-b border-border-soft">
                                    {items.map((item) => (
                                        <div key={`${item.slug}-${item.flavor}`} className="flex gap-3">
                                            <div className="relative w-14 h-14 rounded-xl bg-ivory border border-border-soft overflow-hidden flex-shrink-0 p-1">
                                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-herbal-green truncate">{item.name}</p>
                                                <p className="text-[10px] text-warm-orange font-bold uppercase tracking-wider">{item.flavor}</p>
                                                <p className="text-[10px] text-text-muted font-medium mt-0.5">{item.boxCount} 盒</p>
                                                <p className="text-[10px] text-morning-green-dark font-bold mt-1">${pricePerBox.toFixed(2)} / 盒</p>
                                            </div>
                                            <span className="text-sm font-bold text-herbal-green self-center">
                                                ${(pricePerBox * item.boxCount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 py-6 border-b border-border-soft text-sm font-medium">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Subtotal</span>
                                        <span className="text-text-main font-bold">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Shipping</span>
                                        <span className="text-morning-green-dark font-bold">Calculated at checkout</span>
                                    </div>
                                    {/* Add Tax if needed */}
                                </div>

                                <div className="flex justify-between pt-6 mb-4">
                                    <span className="text-sm font-bold text-herbal-green">Estimated Total</span>
                                    <span className="text-2xl font-black text-herbal-green">${totalPrice.toFixed(2)}</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-ivory/50 flex items-start gap-3 mt-4">
                                    <Truck size={18} className="text-morning-green-dark flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-herbal-green">3-5 Business Days Delivery</p>
                                        <p className="text-[10px] text-text-muted mt-0.5">Reliable international shipping to US, UK, AU & SG.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .input-base {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border-radius: 1rem;
                    background-color: #fff;
                    border: 1px solid #e5e7eb;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }
                .input-base:focus {
                    outline: none;
                    border-color: #f59e0b;
                    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
                }
            `}</style>
        </>
    );
}

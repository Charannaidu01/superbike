import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, LogOut, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase, isLiveSupabase } from '../services/supabase';
import { useBuildStore } from '../store/useBuildStore';

export default function Auth() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, setAuthUser } = useBuildStore();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setAuthUser(data.session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, [setAuthUser]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!isLiveSupabase || !supabase) {
      setMessage('Backend is not connected yet. Add your Supabase URL and anon key to the project.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() || email.split('@')[0] } }
        });
        if (error) throw error;
        if (data.session?.user) {
          setAuthUser(data.session.user);
          navigate('/studio');
        } else {
          setMessage('Account created. Check your email to confirm your account, then sign in.');
          setMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthUser(data.user);
        navigate('/studio');
      }
    } catch (err) {
      setMessage(err.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!supabase || !isLiveSupabase) {
      setMessage('Backend is not connected yet.');
      return;
    }
    if (!email) {
      setMessage('Enter your email address first.');
      return;
    }
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });
    setBusy(false);
    if (error) setMessage(error.message);
    else { setResetSent(true); setMessage('Password reset email sent.'); }
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    logout();
    navigate('/');
  };

  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-12 px-4 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-3xl border border-white/5 p-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center overflow-hidden">
                {user.photo ? <img src={user.photo} alt="Profile" className="w-full h-full object-cover" /> : <User className="text-brand-orange" size={32} />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-brand-orange uppercase font-bold tracking-widest font-mono">Account</p>
                <h1 className="text-2xl font-extrabold text-white mt-1">{user.name}</h1>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <button onClick={signOut} className="px-4 py-2 rounded-xl bg-red-950/20 border border-red-500/10 text-red-400 text-xs font-bold flex items-center gap-2">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5"><h3 className="font-bold">Your account is active</h3><p className="text-xs text-gray-400 mt-2">You can now upload bike photos and use your private studio.</p></div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5"><h3 className="font-bold">Photo storage</h3><p className="text-xs text-gray-400 mt-2">Uploaded photos are stored in your Supabase account storage.</p></div>
            </div>
            <button onClick={() => navigate('/studio')} className="w-full py-3 rounded-xl bg-brand-orange text-white text-sm font-bold">Open Customization Studio</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-12 px-4 flex items-center justify-center">
      <div className="glass w-full max-w-md rounded-3xl border border-white/5 p-8 shadow-2xl">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white text-xs flex items-center gap-1 mb-8"><ArrowLeft size={14}/> Back home</button>
        <div className="text-center space-y-2 mb-7">
          <span className="text-[10px] text-brand-orange uppercase font-bold tracking-widest font-mono">Real Account</span>
          <h1 className="text-2xl font-extrabold text-white">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-xs text-gray-400">Use your real email and password. No fake/demo login.</p>
        </div>
        <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6">
          <button onClick={() => {setMode('signin');setMessage('')}} className={`flex-1 py-2.5 rounded-lg text-xs font-bold ${mode==='signin'?'bg-white/10 text-white':'text-gray-500'}`}>Sign In</button>
          <button onClick={() => {setMode('signup');setMessage('')}} className={`flex-1 py-2.5 rounded-lg text-xs font-bold ${mode==='signup'?'bg-white/10 text-white':'text-gray-500'}`}>Create Account</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && <label className="block"><span className="text-[10px] text-gray-400 font-bold uppercase">Name</span><div className="relative mt-1"><User size={15} className="absolute left-3 top-3.5 text-gray-500"/><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-9 text-sm text-white" placeholder="Your name" required/></div></label>}
          <label className="block"><span className="text-[10px] text-gray-400 font-bold uppercase">Email</span><div className="relative mt-1"><Mail size={15} className="absolute left-3 top-3.5 text-gray-500"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-9 text-sm text-white" placeholder="you@example.com" required/></div></label>
          <label className="block"><span className="text-[10px] text-gray-400 font-bold uppercase">Password</span><div className="relative mt-1"><Lock size={15} className="absolute left-3 top-3.5 text-gray-500"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-9 text-sm text-white" placeholder="At least 6 characters" minLength={6} required/></div></label>
          <button disabled={busy} className="w-full bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white font-extrabold text-sm py-3.5 rounded-xl">{busy ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}</button>
        </form>
        {mode === 'signin' && <button onClick={resetPassword} disabled={busy} className="w-full mt-3 text-xs text-gray-400 hover:text-brand-orange">Forgot password? Send reset email</button>}
        {message && <div className="mt-4 text-xs text-gray-300 bg-white/[0.03] border border-white/5 rounded-xl p-3 flex gap-2"><CheckCircle size={14} className="text-brand-orange shrink-0"/><span>{message}</span></div>}
        {resetSent && <p className="text-[10px] text-gray-500 mt-3 text-center">Check your inbox and follow the password reset link.</p>}
      </div>
    </div>
  );
}

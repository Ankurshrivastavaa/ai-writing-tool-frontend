import React, { useState, useEffect } from 'react';
import { Loader, Copy, Download, RefreshCw, LogOut, Menu, X } from 'lucide-react';

export default function AIWritingTool() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contentType, setContentType] = useState('linkedin');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedContent, setSavedContent] = useState([]);
  const [credits, setCredits] = useState(10);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const API_URL = 'https://ai-writing-tool-backend.onrender.com';

  const contentTypes = {
    linkedin: { label: 'LinkedIn Post', icon: '💼' },
    email: { label: 'Cold Email', icon: '📧' },
    blog: { label: 'Blog Introduction', icon: '📝' },
    tweet: { label: 'Tweet Thread', icon: '🐦' },
    description: { label: 'Product Description', icon: '🛍️' },
  };

  // ✅ FIX 1: Check token on page load so user stays logged in after refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.credits !== undefined) {
            setCredits(data.credits);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  // ✅ FIX 2: Show error messages on login failure
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        setCredits(data.credits || 10);
      } else {
        setAuthError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setAuthError('Cannot connect to server. Please try again.');
    }
    setAuthLoading(false);
  };

  // ✅ FIX 3: Show error messages on signup failure
  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        setCredits(10);
      } else {
        setAuthError(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setAuthError('Cannot connect to server. Please try again.');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setSavedContent([]);
    setGeneratedContent('');
    setCredits(10);
  };

  // ✅ FIX 4: Show error if generation fails
  const generateContent = async () => {
    if (!topic.trim()) {
      setGenerateError('Please enter a topic.');
      return;
    }
    if (credits <= 0) {
      setGenerateError('You are out of credits! Upgrade to Pro to continue.');
      return;
    }

    setGenerateError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentType, topic }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedContent(data.content);
        setCredits(data.creditsRemaining);
      } else {
        setGenerateError(data.error || 'Generation failed. Please try again.');
      }
    } catch (error) {
      setGenerateError('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  const saveContent = async () => {
    if (!generatedContent) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentType, topic, content: generatedContent }),
      });

      if (response.ok) {
        const data = await response.json();
        setSavedContent([data.saved, ...savedContent]);
        alert('Content saved successfully!');
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const downloadPDF = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contentType}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">✨ AI Writer</h1>
              <p className="text-purple-100">Create professional content in seconds</p>
            </div>

            <div className="p-8">
              {/* ✅ Error message display */}
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={handleSignup}
                disabled={authLoading}
                className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50"
              >
                {authLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Get 10 free credits to start! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">✨</div>
            <h1 className="text-xl font-bold text-gray-800">AI Writer</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Credits:</span>
              <span className="font-bold text-blue-600">{credits}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Credits:</span>
              <span className="font-bold text-blue-600">{credits}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left text-gray-600 hover:text-gray-800 py-2"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Content Types</h2>
              <div className="space-y-2">
                {Object.entries(contentTypes).map(([key, { label, icon }]) => (
                  <button
                    key={key}
                    onClick={() => setContentType(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 ${
                      contentType === key
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Tip:</span> One credit per generation. Upgrade to Pro for unlimited access.
                </p>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Generate Content</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What's your topic or idea?
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="E.g., Tips for learning React, or My new product launch..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows="4"
                  />
                </div>

                {/* ✅ Error message for generation */}
                {generateError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {generateError}
                  </div>
                )}

                <button
                  onClick={generateContent}
                  disabled={loading || credits <= 0}
                  className={`w-full py-4 rounded-lg font-bold text-white text-lg transition flex items-center justify-center gap-2 ${
                    loading || credits <= 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Content ✨'
                  )}
                </button>
              </div>
            </div>

            {generatedContent && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">Your Content</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {generatedContent}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => copyToClipboard(generatedContent)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      <Copy size={18} />
                      {copyFeedback || 'Copy'}
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button
                      onClick={generateContent}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                    >
                      <RefreshCw size={18} />
                      Regenerate
                    </button>
                    <button
                      onClick={saveContent}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-semibold ml-auto"
                    >
                      ✓ Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { useState } from 'react';
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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const contentTypes = {
    linkedin: { label: 'LinkedIn Post', icon: '💼' },
    email: { label: 'Cold Email', icon: '📧' },
    blog: { label: 'Blog Introduction', icon: '📝' },
    tweet: { label: 'Tweet Thread', icon: '🐦' },
    description: { label: 'Product Description', icon: '🛍️' },
  };

  // Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
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
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
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
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setSavedContent([]);
    setGeneratedContent('');
  };

  // Generate content
  const generateContent = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    if (credits <= 0) {
      alert('You are out of credits! Upgrade to Pro to continue.');
      return;
    }

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
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setLoading(false);
  };

  // Save content
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
        body: JSON.stringify({
          contentType,
          topic,
          content: generatedContent,
        }),
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

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  // Download as PDF
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
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Sign In
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
                className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Create Account
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
          {/* Sidebar - Content Types */}
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

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Generate Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Generate Content</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Topic Input */}
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

                {/* Generate Button */}
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

            {/* Generated Content */}
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

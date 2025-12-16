import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import RippleGrid from './components/RippleGrid'
import Ribbons from './components/Ribbons'
import { Link2, Copy, BarChart3, Server, Activity, Loader2, Sparkles, X } from 'lucide-react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { WelcomeTour } from "@/components/WelcomeTour"
import GradientText from "@/components/GradientText"
import MagicButton from "@/components/MagicButton"
import { FilePreviewDialog } from "@/components/Dialogs"

function App() {
    const [url, setUrl] = useState('')
    const [customAlias, setCustomAlias] = useState('')
    const [result, setResult] = useState(null)
    const [nodes, setNodes] = useState([])
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')
    const [tourOpen, setTourOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState({ name: "", url: "" });

    const handlePreviewClick = (name, url) => {
        setCurrentFile({ name, url });
        setPreviewOpen(true);
    };

    const fetchNodes = async () => {
        try {
            const res = await axios.get('/api/nodes')
            if (res.data && res.data.nodes) {
                setNodes(res.data.nodes)
            }
        } catch (e) {
            console.error("Failed to fetch nodes", e)
        }
    }

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenWelcomeTour')
        if (!hasSeenTour) {
            setTourOpen(true)
        }

        fetchNodes()
        const interval = setInterval(fetchNodes, 3000)
        return () => clearInterval(interval)
    }, [])

    const handleShorten = async () => {
        if (!url) return
        setLoading(true)
        setError('')
        setResult(null)
        try {
            let finalUrl = url.trim()
            // Check if URL has any protocol (e.g. http://, https://, ftp://)
            if (!/^[a-zA-Z]+:\/\//.test(finalUrl)) {
                finalUrl = 'https://' + finalUrl
            }
            const res = await axios.post('/api/shorten', { originalUrl: finalUrl, customAlias: customAlias })
            setResult(res.data)
            setUrl('')
            setCustomAlias('')
            fetchNodes()
        } catch (e) {
            setError('Failed to shorten URL. Is the backend running?')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(`http://localhost:8080/api/${result.shortKey}`)
            alert("Copied!")
        }
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <WelcomeTour open={tourOpen} onOpenChange={setTourOpen} />
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <RippleGrid
                    enableRainbow={false}
                    gridColor="#ffffff"
                    rippleIntensity={0.05}
                    gridSize={10}
                    gridThickness={15}
                    mouseInteraction={true}
                    mouseInteractionRadius={1.2}
                    opacity={0.8}
                />
            </div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                <Ribbons
                    baseThickness={60}
                    colors={['#ff0055']}
                    speedMultiplier={1.2}
                    maxAge={1500}
                    enableFade={false}
                    enableShaderEffect={true}
                />
            </div>

            <AppSidebar onStartTour={() => setTourOpen(true)} />

            <SidebarInset className="bg-transparent z-10 w-full h-screen overflow-hidden flex flex-col">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 bg-black/20 backdrop-blur-md">
                    <div className="relative group">
                        <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 h-14 w-14 [&_svg]:size-9 transition-all" />
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-black/90 border border-white/20 text-white text-base font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                            Sidebar
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3">
                        <Activity className="text-yellow-400 animate-pulse" size={28} />
                        <span className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1">
                            URLShort<span className="text-yellow-400">.io</span>
                        </span>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-full">

                        {/* 1. Header & Shortener Widget (Span 2 cols) */}
                        <motion.div
                            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:col-span-2 flex flex-col justify-center min-h-[400px]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="mb-8 max-w-full overflow-hidden">
                                <GradientText
                                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                                    animationSpeed={3}
                                    showBorder={false}
                                    className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 tracking-tighter shadow-blue-500/20 drop-shadow-2xl text-wrap break-words"
                                >
                                    URL SHORTENER
                                </GradientText>
                                <p className="text-gray-400 text-2xl mt-4 font-light tracking-wide">Replication • Consistent Hashing • Fault Tolerance</p>
                            </div>


                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="relative">
                                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Paste long URL here..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xl placeholder:text-xl"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">/</span>
                                        <input
                                            type="text"
                                            placeholder="Custom alias (optional)"
                                            value={customAlias}
                                            onChange={(e) => setCustomAlias(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-xl placeholder:text-xl"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <MagicButton
                                        title="SHORTEN"
                                        icon={<Sparkles size={16} className="text-purple-300" />}
                                        position="right"
                                        handleClick={handleShorten}
                                        loading={loading}
                                        otherClasses="w-full md:w-60 md:mt-0"
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2 gap-4">
                                            <a href={`http://localhost:8080/api/${result.shortKey}`} target="_blank" className="text-cyan-400 text-xl font-mono hover:underline break-all">
                                                urlshort.io/{result.shortKey}
                                            </a>
                                            <div className="flex gap-2">
                                                <button onClick={copyToClipboard} className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                                    <Copy size={24} />
                                                </button>
                                                <button onClick={() => setResult(null)} className="text-white/60 hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full">
                                                    <X size={24} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-base text-gray-500 font-mono">
                                            <span>Handler: {result.nodeAddress}</span>
                                            <span>Replica: {result.replica ? 'YES' : 'NO'}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* 2. System Status Widget */}
                        <motion.div
                            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Activity size={32} className="text-pink-500 mb-4 absolute top-6 left-6" />
                            <div className="text-center z-10">
                                <span className="text-6xl font-bold text-white block mb-2">
                                    {nodes.filter(n => n.status === 'Online').length}/{nodes.length}
                                </span>
                                <span className="text-gray-400 uppercase tracking-widest text-sm">Nodes Active</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent pointer-events-none" />
                        </motion.div>

                        {/* 3. Storage Nodes List (Span full width mobile, 1 col desktop) */}
                        <motion.div
                            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:row-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Server className="text-blue-500" />
                                <h2 className="text-2xl font-bold text-white">Node Cluster</h2>
                            </div>
                            <div className="space-y-3">
                                {nodes.map((node, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-l-transparent hover:bg-white/10 transition-colors" style={{ borderLeftColor: node.status === 'Online' ? '#10b981' : '#ef4444' }}>
                                        <div className="flex flex-col">
                                            <span className="text-white font-mono text-xl">{node.url}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">ID: {idx + 1}</span>
                                                <span className="text-blue-400 text-sm font-semibold">• Data Shard {String.fromCharCode(65 + idx)}</span>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${node.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
                                    </div>
                                ))}
                                {nodes.length === 0 && <div className="text-center text-gray-600 py-4">Searching for nodes...</div>}
                            </div>
                        </motion.div>

                        {/* 4. Quick Actions / Filler */}
                        <motion.div
                            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:col-span-2 flex flex-col justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white">JAVA Source Code</h3>
                                <div className="relative group ml-auto">
                                    <SidebarTrigger className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg h-14 w-14 [&_svg]:size-9 transition-all" />
                                    <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-black/90 border border-white/20 text-white text-base font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                        Sidebar
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button onClick={() => handlePreviewClick("Dashboard Source", "/docs/source-url-dashboard.html")} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-cyan-500/30 text-left">
                                    <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
                                        <Activity size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold text-xl">Dashboard JAR</span>
                                        <span className="text-white/40 text-base">Source Code</span>
                                    </div>
                                </button>

                                <button onClick={() => handlePreviewClick("Router Source", "/docs/source-url-router.html")} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-purple-500/30 text-left">
                                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                                        <Server size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold text-xl">Router JAR</span>
                                        <span className="text-white/40 text-base">Source Code</span>
                                    </div>
                                </button>

                                <button onClick={() => handlePreviewClick("Node Source", "/docs/source-url-node.html")} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-emerald-500/30 text-left">
                                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                                        <Server size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold text-xl">Node JAR</span>
                                        <span className="text-white/40 text-base">Source Code</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </SidebarInset>
            <FilePreviewDialog
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                fileUrl={currentFile.url}
                fileName={currentFile.name}
            />
        </SidebarProvider >
    )
}

export default App

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileCode, ChevronRight, ChevronDown, X, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const FileTreeNode = ({ node, onSelect, selectedPath, depth = 0 }) => {
    const [expanded, setExpanded] = useState(false);
    const isSelected = selectedPath === node.path;

    const handleClick = (e) => {
        e.stopPropagation();
        if (node.type === 'directory') {
            setExpanded(!expanded);
        } else {
            onSelect(node);
        }
    };

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-white/5 text-gray-300'}`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={handleClick}
            >
                {node.type === 'directory' && (
                    <span className="text-gray-500">
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
                {node.type === 'directory' ? (
                    <Folder size={16} className="text-yellow-500" />
                ) : (
                    <FileCode size={16} className="text-blue-400" />
                )}
                <span className="text-xl truncate">{node.name}</span>
            </div>
            {node.type === 'directory' && expanded && (
                <div className="ml-1 border-l border-white/5">
                    {node.children.map((child) => (
                        <FileTreeNode
                            key={child.path}
                            node={child}
                            onSelect={onSelect}
                            selectedPath={selectedPath}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function SourceViewer({ open, onOpenChange }) {
    const [manifest, setManifest] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (open) {
            fetch('/source-code/manifest.json')
                .then(res => res.json())
                .then(data => setManifest(data))
                .catch(err => console.error("Failed to load manifest", err));
        }
    }, [open]);

    const handleFileSelect = async (node) => {
        setSelectedFile(node);
        setLoading(true);
        try {
            const res = await fetch(`/source-code/${node.path}`);
            const text = await res.text();
            setFileContent(text);
        } catch (e) {
            setFileContent('Failed to load file content.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(fileContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] bg-[#0f111a] text-white border-gray-800 p-0 overflow-hidden flex flex-col rounded-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1b26]">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <FileCode className="text-orange-400" />
                        POM Configuration Explorer
                    </DialogTitle>
                    <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/4 min-w-[250px] max-w-[400px] border-r border-white/10 overflow-y-auto p-4 bg-[#13151f]">
                        <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-4">Project Modules</h3>
                        <div className="space-y-1">
                            {manifest.map((module) => (
                                <FileTreeNode
                                    key={module.name}
                                    node={module}
                                    onSelect={handleFileSelect}
                                    selectedPath={selectedFile?.path}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Code View */}
                    <div className="flex-1 flex flex-col bg-[#0f111a] relative">
                        {selectedFile ? (
                            <>
                                <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#1a1b26]/50">
                                    <span className="text-sm font-mono text-gray-300">{selectedFile.path}</span>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors border border-white/5"
                                    >
                                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 animate-pulse">
                                            Loading content...
                                        </div>
                                    ) : (
                                        <pre className="font-mono text-xl leading-loose text-gray-300">
                                            <code>{fileContent}</code>
                                        </pre>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <FileCode size={48} className="mb-4 opacity-20" />
                                <p>Select a file to view source</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

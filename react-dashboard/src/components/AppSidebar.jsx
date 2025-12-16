import React, { useState } from "react"
import { BarChart3, BookOpen, FileText, Github, MessageSquare, Files, Box, Cpu, FileCode, PlayCircle, Code2 } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DownloadConfirmDialog, FilePreviewDialog } from "./Dialogs"
import SourceViewer from "./SourceViewer"

export function AppSidebar({ onStartTour }) {
    const [downloadOpen, setDownloadOpen] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [sourceViewerOpen, setSourceViewerOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState({ name: "", url: "" });

    const handleDownloadClick = (name, url) => {
        setCurrentFile({ name, url });
        setDownloadOpen(true);
    };

    const processDownload = () => {
        const link = document.createElement("a");
        link.href = currentFile.url;
        link.download = currentFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const processPreview = () => {
        setPreviewOpen(true);
    }

    const isPreviewable = currentFile.name.endsWith(".html") || currentFile.name.endsWith(".pdf");

    return (
        <>
            <Sidebar className="border-r border-white/10 bg-black/40 backdrop-blur-xl text-lg">
                <SidebarContent className="bg-transparent pt-4">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-2xl font-bold text-white mb-6 pl-2 uppercase tracking-widest shadow-blue-500/50 drop-shadow-lg">
                            Dashboard
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>




                                {/* Project Insights */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" onClick={() => handleDownloadClick("project-insight.html", "/docs/project-insight.html")} className="hover:bg-white/10 transition-colors h-16 group">
                                        <BarChart3 className="size-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        <span className="text-2xl font-medium text-gray-100 group-hover:text-white">Project Insights</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Maven Docs */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" className="hover:bg-white/10 transition-colors h-16 group">
                                        <BookOpen className="size-6 text-pink-400 group-hover:text-pink-300 transition-colors" />
                                        <span className="text-2xl font-medium text-gray-100 group-hover:text-white">Maven Docs</span>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton size="md" onClick={() => handleDownloadClick("maven-commands.html", "/docs/maven-commands.html")} className="h-12 text-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer">
                                                <FileText className="!size-6 !text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]" />
                                                <span>Commands</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton size="md" onClick={() => handleDownloadClick("architecture.html", "/docs/architecture.html")} className="h-12 text-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer">
                                                <Cpu className="!size-6 !text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]" />
                                                <span>Architecture</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </SidebarMenuItem>

                                {/* Files */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" className="hover:bg-white/10 transition-colors h-16 group cursor-pointer">
                                        <Files className="size-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                        <span className="text-2xl font-medium text-gray-100 group-hover:text-white">Structure</span>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton size="md" onClick={() => handleDownloadClick("war-structure.html", "/docs/war-structure.html")} className="h-12 text-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer">
                                                <Box className="!size-6 !text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                                                <span>WAR (Web Archive)</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton size="md" onClick={() => handleDownloadClick("jar-structure.html", "/docs/jar-structure.html")} className="h-12 text-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer">
                                                <FileCode className="!size-6 !text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                                                <span>JAR (Java Archive)</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </SidebarMenuItem>

                                {/* Source Code */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" onClick={() => setSourceViewerOpen(true)} className="hover:bg-white/10 transition-colors h-16 group cursor-pointer">
                                        <Code2 className="size-6 text-red-400 group-hover:text-red-300 transition-colors" />
                                        <span className="text-2xl font-medium text-gray-100 group-hover:text-white">POM Files</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Product Tour */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" onClick={onStartTour} className="hover:bg-white/10 transition-colors h-16 group cursor-pointer">
                                        <PlayCircle className="size-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                                        <span className="text-2xl font-medium text-gray-100 group-hover:text-white">Product Tour</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>



                                {/* GitHub */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" onClick={() => window.open("https://github.com/KARTIKEYARAWAT/DevOpsProject-URLShort.io", "_blank")} className="hover:bg-white/10 transition-colors h-16 group">
                                        <Github className="size-6 text-white group-hover:text-gray-300 transition-colors" />
                                        <span className="text-2xl font-medium text-gray-100 group-hover:text-white">GitHub</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar >

            <DownloadConfirmDialog
                open={downloadOpen}
                onOpenChange={setDownloadOpen}
                fileName={currentFile.name}
                onConfirm={processDownload}
                showPreview={isPreviewable}
                onPreview={processPreview}
            />

            <FilePreviewDialog
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                fileUrl={currentFile.url}
                fileName={currentFile.name}
            />
            <SourceViewer
                open={sourceViewerOpen}
                onOpenChange={setSourceViewerOpen}
            />
        </>
    )
}

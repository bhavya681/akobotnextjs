"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search,
  Ticket,
  Star,
  DollarSign,
  Tag,
  Building2,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Download,
  Plus,
  Globe,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TabType = "Tickets" | "Featuring" | "Itome" | "Flipaty" | "Cominany";

const ToolsPage = () => {
  const [activeTopTab, setActiveTopTab] = useState<TabType>("Tickets");
  const [searchQuery, setSearchQuery] = useState("");


  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  // Dummy data for Tickets tab
  const ticketsData = [
    {
      id: "TK-001",
      title: "Website Performance Issue",
      status: "Open",
      priority: "High",
      assignee: "John Doe",
      created: "2024-01-15",
      category: "Technical",
    },
    {
      id: "TK-002",
      title: "Feature Request: Dark Mode",
      status: "In Progress",
      priority: "Medium",
      assignee: "Jane Smith",
      created: "2024-01-14",
      category: "Enhancement",
    },
    {
      id: "TK-003",
      title: "Bug Report: Login Error",
      status: "Resolved",
      priority: "High",
      assignee: "Mike Johnson",
      created: "2024-01-13",
      category: "Bug",
    },
    {
      id: "TK-004",
      title: "API Integration Request",
      status: "Open",
      priority: "Low",
      assignee: "Sarah Williams",
      created: "2024-01-12",
      category: "Integration",
    },
    {
      id: "TK-005",
      title: "UI/UX Improvements",
      status: "In Progress",
      priority: "Medium",
      assignee: "David Brown",
      created: "2024-01-11",
      category: "Design",
    },
  ];

  // Dummy data for Featuring tab
  const featuringData = [
    {
      id: 1,
      name: "AI-Powered Analytics",
      category: "Analytics",
      status: "Active",
      views: 12500,
      likes: 892,
      rating: 4.8,
      description: "Advanced analytics dashboard with AI insights",
    },
    {
      id: 2,
      name: "Smart Automation Suite",
      category: "Automation",
      status: "Active",
      views: 9800,
      likes: 654,
      rating: 4.6,
      description: "Automate your workflow with intelligent tools",
    },
    {
      id: 3,
      name: "Real-time Collaboration",
      category: "Collaboration",
      status: "Featured",
      views: 15200,
      likes: 1200,
      rating: 4.9,
      description: "Work together seamlessly in real-time",
    },
    {
      id: 4,
      name: "Security Dashboard",
      category: "Security",
      status: "Active",
      views: 8700,
      likes: 543,
      rating: 4.7,
      description: "Monitor and manage security in one place",
    },
  ];

  // Dummy data for Itome tab
  const itomeData = [
    {
      id: 1,
      title: "Q1 2024 Revenue Report",
      type: "Financial",
      amount: "$125,000",
      date: "2024-01-15",
      status: "Completed",
    },
    {
      id: 2,
      title: "User Growth Analysis",
      type: "Analytics",
      amount: "15,234 users",
      date: "2024-01-14",
      status: "In Review",
    },
    {
      id: 3,
      title: "Marketing Campaign Results",
      type: "Marketing",
      amount: "$45,000",
      date: "2024-01-13",
      status: "Completed",
    },
    {
      id: 4,
      title: "Product Launch Metrics",
      type: "Product",
      amount: "2,500 signups",
      date: "2024-01-12",
      status: "Pending",
    },
  ];

  // Dummy data for Flipaty tab
  const flipatyData = [
    {
      id: 1,
      name: "Enterprise Plan",
      price: "$299/month",
      users: 500,
      features: ["Unlimited Storage", "Priority Support", "Advanced Analytics"],
      status: "Active",
    },
    {
      id: 2,
      name: "Professional Plan",
      price: "$99/month",
      users: 250,
      features: ["100GB Storage", "Email Support", "Basic Analytics"],
      status: "Active",
    },
    {
      id: 3,
      name: "Starter Plan",
      price: "$29/month",
      users: 120,
      features: ["10GB Storage", "Community Support"],
      status: "Active",
    },
  ];

  // Dummy data for Cominany tab
  const cominanyData = [
    {
      id: 1,
      name: "TechCorp Inc.",
      industry: "Technology",
      employees: 250,
      revenue: "$5.2M",
      status: "Active",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      name: "DesignStudio",
      industry: "Design",
      employees: 45,
      revenue: "$1.8M",
      status: "Active",
      location: "New York, NY",
    },
    {
      id: 3,
      name: "DataSolutions",
      industry: "Data Analytics",
      employees: 120,
      revenue: "$3.5M",
      status: "Active",
      location: "Austin, TX",
    },
    {
      id: 4,
      name: "CloudServices",
      industry: "Cloud Computing",
      employees: 200,
      revenue: "$4.8M",
      status: "Active",
      location: "Seattle, WA",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "active":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30";
      case "in progress":
      case "in review":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30";
      case "resolved":
      case "featured":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const renderTicketsContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Support Tickets
          </h2>
          <p className="text-sm mt-1.5 text-gray-600 dark:text-gray-400">
            Manage and track all support tickets efficiently
          </p>
        </div>
       <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
  <DialogTrigger asChild>
    <Button className="gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-sm cursor-pointer">
      <Plus className="w-4 h-4" />
      New Ticket
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0f0f0f] border-gray-200 dark:border-gray-800">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold">Create New Ticket</DialogTitle>
      <DialogDescription>
        Provide details about the issue you are facing.
      </DialogDescription>
    </DialogHeader>
    
    <div className="grid gap-6 py-4">
      {/* Ticket Title */}
      <div className="grid gap-2">
        <Label htmlFor="title">Ticket Title</Label>
        <Input id="title" placeholder="Summary of the issue" className="bg-black/95 border-gray-200 dark:border-gray-800" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select>
            <SelectTrigger className="bg-black/95 border-gray-200 dark:border-gray-800">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technical</SelectItem>
              <SelectItem value="bill">Billing</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Priority */}
        <div className="grid gap-2">
          <Label>Priority</Label>
          <Select>
            <SelectTrigger className="bg-black/95 border-gray-200 dark:border-gray-800">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="med">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" placeholder="Details..." className="min-h-[100px] bg-black/95 border-gray-200 dark:border-gray-800" />
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setIsTicketModalOpen(false)}>Cancel</Button>
      <Button onClick={() => setIsTicketModalOpen(false)}>Create Ticket</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      </div>

      <Card className="border transition-all duration-300 ease-in-out bg-white border-gray-200 shadow-md hover:shadow-lg dark:bg-[#0f0f0f] dark:border-gray-800 dark:shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0f0f0f]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">
                Tickets Overview
              </CardTitle>
              <CardDescription className="mt-1">
                All support tickets and their current status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 transition-all duration-300 ease-in-out bg-white border-gray-200 shadow-sm focus:shadow-md focus:border-primary/50 dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md dark:shadow-none"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 hover:bg-gray-50 bg-white dark:border-gray-800 dark:hover:bg-gray-900/50 dark:bg-[#0f0f0f]">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Ticket ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Priority
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Assignee
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Created
                  </TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketsData.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="border-b border-gray-200 hover:bg-gray-50 bg-white dark:border-gray-800 dark:hover:bg-gray-900/50 dark:bg-[#0f0f0f]"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {ticket.id}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {ticket.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(ticket.status))}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(ticket.priority))}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {ticket.assignee}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {ticket.created}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFeaturingContent = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Featured Products
        </h2>
        <p className="text-sm mt-1.5 text-gray-600 dark:text-gray-400">
          Discover our most popular features and products
        </p>
      </div>

      {/* MODAL START */}
      <Dialog open={isFeatureModalOpen} onOpenChange={setIsFeatureModalOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-sm cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Feature
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0f0f0f] border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Feature</DialogTitle>
            <DialogDescription>
              Enter the details to showcase a new product or tool.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Feature Name */}
            <div className="grid gap-2">
              <Label htmlFor="feature-name">Feature Name</Label>
              <Input 
                id="feature-name" 
                placeholder="e.g., Advanced AI Analytics" 
                className="bg-black/95 border-gray-200 dark:border-gray-800"
              />
            </div>

            {/* Category Select */}
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger className="bg-black/95 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description Textarea */}
            <div className="grid gap-2">
              <Label htmlFor="feature-desc">Description</Label>
              <Textarea 
                id="feature-desc" 
                placeholder="Describe what this feature does..." 
                className="min-h-[120px] bg-black/95 border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsFeatureModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsFeatureModalOpen(false)} className="bg-primary shadow-lg shadow-primary/20">
              Add to Showcase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* MODAL END */}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {featuringData.map((item) => (
        <Card
          key={item.id}
          className="transition-all duration-300 ease-in-out bg-white border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300 dark:bg-[#0f0f0f] dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-lg"
        >
          {/* ... rest of your card code remains exactly the same */}
          <CardHeader className="bg-white dark:bg-transparent">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    {item.name}
                  </CardTitle>
                  {item.status === "Featured" && (
                    <Badge className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className="mb-3 text-xs bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                >
                  {item.category}
                </Badge>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white dark:bg-transparent">
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-border">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{item.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{item.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">{item.likes}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="transition-all duration-300 ease-in-out shadow-sm hover:shadow-md dark:shadow-none"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

  const renderItomeContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Income Reports
          </h2>
          <p className="text-sm mt-1.5 text-gray-600 dark:text-gray-400">
            Track revenue and financial metrics
          </p>
        </div>
        <Button className="gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-sm">
          <ExternalLink className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$195,000", change: "+12.5%", icon: DollarSign },
          { label: "Active Users", value: "15,234", change: "+8.2%", icon: Users },
          { label: "New Signups", value: "2,500", change: "+15.3%", icon: TrendingUp },
          { label: "Conversion Rate", value: "3.2%", change: "+0.5%", icon: BarChart3 },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="transition-all duration-300 ease-in-out bg-white border-gray-200 shadow-md hover:shadow-lg dark:bg-[#0f0f0f] dark:border-gray-800 dark:hover:shadow-md"
            >
              <CardHeader className="pb-3 bg-white dark:bg-transparent">
                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-transparent">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border transition-all duration-300 ease-in-out bg-white border-gray-200 shadow-md hover:shadow-lg dark:bg-[#0f0f0f] dark:border-gray-800 dark:shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0f0f0f]">
          <CardTitle className="text-gray-900 dark:text-white">
            Recent Reports
          </CardTitle>
          <CardDescription>Latest income and analytics reports</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 hover:bg-gray-50 bg-white dark:border-gray-800 dark:hover:bg-gray-900/50 dark:bg-[#0f0f0f]">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itomeData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50 bg-white dark:border-gray-800 dark:hover:bg-gray-900/50 dark:bg-[#0f0f0f]"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                      {item.amount}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {item.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-transparent"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

 const renderFlipatyContent = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Subscription Plans</h2>
        <p className="text-sm mt-1.5 text-gray-400">Manage pricing and subscription tiers</p>
      </div>

      {/* NEW PLAN MODAL */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 transition-all duration-300 shadow-md hover:shadow-indigo-500/20 cursor-pointer bg-primary">
            <Plus className="w-4 h-4" /> New Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-gray-800 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create Subscription Plan</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure the pricing and features for a new tier.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
  {/* Plan Name */}
  <div className="grid gap-2">
    <Label htmlFor="pname" className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Plan Name</Label>
    <Input 
      id="pname" 
      placeholder="e.g. Ultimate Plan" 
      className="bg-[#0f0f0f] border-gray-800 text-gray-300 h-11 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
    />
  </div>

  {/* Monthly Price */}
  <div className="grid gap-2">
    <Label htmlFor="price" className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Monthly Price</Label>
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <Input 
        id="price" 
        placeholder="e.g. 299" 
        className="pl-9 bg-[#0f0f0f] border-gray-800 text-gray-300 h-11 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
      />
    </div>
  </div>

  {/* Features List */}
  <div className="grid gap-2">
    <Label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Key Features (Comma Separated)</Label>
    <Textarea 
      placeholder="Unlimited Storage, Priority Support, Advanced Analytics" 
      className="bg-[#0f0f0f] border-gray-800 text-gray-300 min-h-[100px] focus-visible:ring-1 focus-visible:ring-indigo-500/50"
    />
  </div>
</div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPlanModalOpen(false)} className="hover:bg-gray-900">
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 px-8" onClick={() => setIsPlanModalOpen(false)}>
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    {/* Plan Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {flipatyData.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "transition-all duration-300 bg-[#0f0f0f] border-gray-800 relative overflow-hidden",
            plan.id === 1 && "ring-2 ring-primary/50 border-primary/50 shadow-[0_0_25px_rgba(99,102,241,0.15)]"
          )}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 border-b border-gray-800 pb-4">
                <Users className="w-4 h-4" />
                <span>{plan.users.toLocaleString()} active users</span>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Features:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full mt-6 h-11 transition-all cursor-pointer",
                  plan.id === 1 ? "bg-primary hover:bg-primary/90" : "bg-transparent border border-gray-800 hover:bg-gray-900"
                )}
                variant={plan.id === 1 ? "default" : "outline"}
              >
                {plan.id === 1 ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const renderCominanyContent = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Companies</h2>
        <p className="text-sm mt-1.5 text-gray-400">Manage company profiles and information</p>
      </div>

      {/* MODAL START */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 transition-all duration-300 shadow-md hover:shadow-indigo-500/20 cursor-pointer bg-primary">
            <Plus className="w-4 h-4" /> Add Company
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-gray-800 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Register New Company</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the company details to create a new profile.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
  {/* Company Name */}
  <div className="grid gap-2">
    <Label htmlFor="cname" className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Company Name</Label>
    <Input 
      id="cname" 
      placeholder="e.g. TechCorp Inc." 
      className="bg-[#0f0f0f] border-gray-800 text-gray-300 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50 h-11"
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    {/* Industry */}
    <div className="grid gap-2">
      <Label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Industry</Label>
      <Select>
        <SelectTrigger className="bg-[#0f0f0f] border-gray-800 text-gray-300 h-11">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="bg-[#0f0f0f] border-gray-800 text-white">
          <SelectItem value="tech">Technology</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="data">Data Analytics</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Revenue Field - ADDED THIS */}
    <div className="grid gap-2">
      <Label htmlFor="revenue" className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Annual Revenue</Label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input 
          id="revenue" 
          placeholder="e.g. $5.2M" 
          className="pl-9 bg-[#0f0f0f] border-gray-800 text-gray-300 placeholder:text-gray-600 h-11"
        />
      </div>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    {/* Employee Count */}
    <div className="grid gap-2">
      <Label htmlFor="employees" className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Employees</Label>
      <Input 
        id="employees" 
        type="number" 
        placeholder="Count" 
        className="bg-[#0f0f0f] border-gray-800 text-gray-300 h-11"
      />
    </div>

    {/* Location */}
    <div className="grid gap-2">
      <Label htmlFor="loc" className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Location</Label>
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input 
          id="loc" 
          placeholder="City, Country" 
          className="pl-9 bg-[#0f0f0f] border-gray-800 text-gray-300 placeholder:text-gray-600 h-11"
        />
      </div>
    </div>
  </div>
</div>

          <DialogFooter className="mt-2">
            <Button variant="ghost" onClick={() => setIsCompanyModalOpen(false)} className="hover:bg-gray-900">
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 px-6" onClick={() => setIsCompanyModalOpen(false)}>
              Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* MODAL END */}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cominanyData.map((company) => (
        <Card key={company.id} className="bg-[#0f0f0f] border-gray-800 hover:border-gray-700 transition-all shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <CardTitle className="text-xl text-white">{company.name}</CardTitle>
                </div>
                <Badge variant="outline" className="mb-3 bg-gray-900 border-gray-800 text-gray-300">
                  {company.industry}
                </Badge>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" /> <span>{company.employees} employees</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <DollarSign className="w-4 h-4" /> <span>Revenue: {company.revenue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" /> <span>{company.location}</span>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent border-gray-800 hover:bg-gray-900">
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-gray-800 hover:bg-gray-900">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "Tickets", label: "Tickets", icon: Ticket },
    { id: "Featuring", label: "Features", icon: Star },
    { id: "Itome", label: "Report", icon: DollarSign },
    { id: "Flipaty", label: "Pricing", icon: Tag },
    { id: "Cominany", label: "Company", icon: Building2 },
  ];

  const renderContent = () => {
    switch (activeTopTab) {
      case "Tickets":
        return renderTicketsContent();
      case "Featuring":
        return renderFeaturingContent();
      case "Itome":
        return renderItomeContent();
      case "Flipaty":
        return renderFlipatyContent();
      case "Cominany":
        return renderCominanyContent();
      default:
        return renderTicketsContent();
    }
  };

  return (
    <div className="min-h-screen transition-all duration-300 ease-in-out bg-white dark:bg-[#0a0a0a]">
      {/* Top Navigation Bar */}
      <div className="border-b shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out sticky top-0 z-10 border-gray-200 bg-white/95 shadow-md dark:border-gray-800 dark:bg-[#0a0a0a]/95 dark:shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1 flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTopTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out",
                      activeTopTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50 dark:border-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 transition-all duration-300 ease-in-out border-gray-200 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:shadow-none"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 transition-all duration-300 ease-in-out border-gray-200 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:shadow-none"
              >
                <Globe className="w-4 h-4" />
                Red Wertory
              </Button>
            </div>
          </div>
        </div>
        </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-full">
        <AnimatePresence mode="wait">
      <motion.div
            key={activeTopTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        </div>
    </div>
  );
};

export default ToolsPage;

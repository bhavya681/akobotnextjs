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

  // Dynamic Opacity-based styling works flawlessly in both themes
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "active":
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "in progress":
      case "in review":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "resolved":
      case "featured":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "low":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const renderTicketsContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Support Tickets
          </h2>
          <p className="text-sm mt-1.5 text-muted-foreground">
            Manage and track all support tickets efficiently
          </p>
        </div>
        <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg cursor-pointer">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create New Ticket</DialogTitle>
              <DialogDescription>
                Provide details about the issue you are facing.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Ticket Title</Label>
                <Input id="title" placeholder="Summary of the issue" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technical</SelectItem>
                      <SelectItem value="bill">Billing</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
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

              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" placeholder="Details..." className="min-h-[100px]" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTicketModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsTicketModalOpen(false)}>Create Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Tickets Overview</CardTitle>
              <CardDescription className="mt-1">
                All support tickets and their current status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 transition-all duration-300 ease-in-out shadow-sm focus:shadow-md"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
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
                <TableRow className="border-b border-border hover:bg-muted/50">
                  <TableHead className="font-semibold">Ticket ID</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Assignee</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketsData.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs border", getStatusColor(ticket.status))}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs border", getPriorityColor(ticket.priority))}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ticket.assignee}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ticket.created}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-accent"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-accent"
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Featured Products
          </h2>
          <p className="text-sm mt-1.5 text-muted-foreground">
            Discover our most popular features and products
          </p>
        </div>

        <Dialog open={isFeatureModalOpen} onOpenChange={setIsFeatureModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Feature</DialogTitle>
              <DialogDescription>
                Enter the details to showcase a new product or tool.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="feature-name">Feature Name</Label>
                <Input id="feature-name" placeholder="e.g., Advanced AI Analytics" />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
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

              <div className="grid gap-2">
                <Label htmlFor="feature-desc">Description</Label>
                <Textarea 
                  id="feature-desc" 
                  placeholder="Describe what this feature does..." 
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsFeatureModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsFeatureModalOpen(false)} className="shadow-lg shadow-primary/20">
                Add to Showcase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuringData.map((item) => (
          <Card
            key={item.id}
            className="transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:border-border"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <CardTitle className="text-xl">
                      {item.name}
                    </CardTitle>
                    {item.status === "Featured" && (
                      <Badge variant="outline" className="text-xs border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {item.category}
                  </Badge>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{item.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 dark:text-yellow-400" />
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
                  className="transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Income Reports
          </h2>
          <p className="text-sm mt-1.5 text-muted-foreground">
            Track revenue and financial metrics
          </p>
        </div>
        <Button className="gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
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
              className="transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-2xl font-bold mt-2">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest income and analytics reports</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-muted/50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itomeData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{item.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{item.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs border", getStatusColor(item.status))}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-accent"
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Subscription Plans</h2>
          <p className="text-sm mt-1.5 text-muted-foreground">Manage pricing and subscription tiers</p>
        </div>

        <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 transition-all duration-300 shadow-md cursor-pointer">
              <Plus className="w-4 h-4" /> New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create Subscription Plan</DialogTitle>
              <DialogDescription>
                Configure the pricing and features for a new tier.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pname" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan Name</Label>
                <Input id="pname" placeholder="e.g. Ultimate Plan" className="h-11" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="price" placeholder="e.g. 299" className="pl-9 h-11" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Features (Comma Separated)</Label>
                <Textarea placeholder="Unlimited Storage, Priority Support, Advanced Analytics" className="min-h-[100px]" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsPlanModalOpen(false)}>Cancel</Button>
              <Button className="px-8" onClick={() => setIsPlanModalOpen(false)}>Create Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {flipatyData.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "transition-all duration-300 relative overflow-hidden shadow-sm",
              plan.id === 1 && "ring-2 ring-primary border-primary shadow-[0_0_25px_rgba(99,102,241,0.1)]"
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Active</Badge>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-border pb-4">
                  <Users className="w-4 h-4" />
                  <span>{plan.users.toLocaleString()} active users</span>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Features:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full mt-6 h-11 transition-all cursor-pointer"
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Companies</h2>
          <p className="text-sm mt-1.5 text-muted-foreground">Manage company profiles and information</p>
        </div>

        <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 transition-all duration-300 shadow-md cursor-pointer">
              <Plus className="w-4 h-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Register New Company</DialogTitle>
              <DialogDescription>
                Enter the company details to create a new profile.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cname" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                <Input id="cname" placeholder="e.g. TechCorp Inc." className="h-11" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Industry</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="data">Data Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="revenue" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Annual Revenue</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="revenue" placeholder="e.g. $5.2M" className="pl-9 h-11" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employees" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employees</Label>
                  <Input id="employees" type="number" placeholder="Count" className="h-11" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="loc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="loc" placeholder="City, Country" className="pl-9 h-11" />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="ghost" onClick={() => setIsCompanyModalOpen(false)}>Cancel</Button>
              <Button className="px-6" onClick={() => setIsCompanyModalOpen(false)}>Add Company</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cominanyData.map((company) => (
          <Card key={company.id} className="transition-all shadow-md hover:border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="mb-3">
                    {company.industry}
                  </Badge>
                </div>
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" /> <span>{company.employees} employees</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" /> <span>Revenue: {company.revenue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" /> <span>{company.location}</span>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-accent">
                    <Eye className="w-4 h-4 mr-2" /> View Details
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-accent">
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
    <div className="min-h-screen transition-all duration-300 ease-in-out bg-background text-foreground">
      {/* Top Navigation Bar */}
      <div className="border-b shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out sticky top-0 z-10 border-border bg-background/95">
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
                        : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
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
                className="gap-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
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
import React, { useState } from 'react';
import { 
  Users, Package, ShoppingCart, DollarSign, TrendingUp, 
  BarChart3, Eye, Edit, Trash2, Plus, Search, Filter,
  Calendar, Download, RefreshCw, Settings, AlertTriangle,
  CheckSquare, Square, ChevronDown, Bell, X, Archive,
  Mail, UserCheck, UserX, PackageCheck, PackageX
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Bulk operations state
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Alerts state
  const [showAlerts, setShowAlerts] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'low_stock', message: 'MacBook Pro 16" is running low on stock (18 units left)', product: 'MacBook Pro 16"', priority: 'high' },
    { id: 2, type: 'low_stock', message: 'Samsung Galaxy S24 is running low on stock (32 units left)', product: 'Samsung Galaxy S24', priority: 'medium' },
    { id: 3, type: 'order_pending', message: '5 orders are pending processing for more than 24 hours', priority: 'high' },
    { id: 4, type: 'user_inactive', message: '127 users have been inactive for more than 30 days', priority: 'low' }
  ]);

  // Chart data for analytics
  const salesData = [
    { month: 'Jan', sales: 45000, orders: 245, users: 120 },
    { month: 'Feb', sales: 52000, orders: 289, users: 145 },
    { month: 'Mar', sales: 48000, orders: 267, users: 134 },
    { month: 'Apr', sales: 61000, orders: 324, users: 178 },
    { month: 'May', sales: 58000, orders: 312, users: 165 },
    { month: 'Jun', sales: 67000, orders: 356, users: 192 },
    { month: 'Jul', sales: 71000, orders: 378, users: 203 },
    { month: 'Aug', sales: 69000, orders: 367, users: 198 },
    { month: 'Sep', sales: 74000, orders: 392, users: 215 },
    { month: 'Oct', sales: 78000, orders: 415, users: 234 },
    { month: 'Nov', sales: 82000, orders: 438, users: 251 },
    { month: 'Dec', sales: 89000, orders: 467, users: 279 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, sales: 284752 },
    { name: 'Fashion', value: 25, sales: 198234 },
    { name: 'Home & Kitchen', value: 20, sales: 156789 },
    { name: 'Books', value: 12, sales: 98456 },
    { name: 'Sports', value: 8, sales: 67890 }
  ];

  const revenueData = [
    { day: 'Mon', revenue: 12400 },
    { day: 'Tue', revenue: 15600 },
    { day: 'Wed', revenue: 11800 },
    { day: 'Thu', revenue: 18200 },
    { day: 'Fri', revenue: 22400 },
    { day: 'Sat', revenue: 19600 },
    { day: 'Sun', revenue: 16800 }
  ];

  const COLORS = ['#FF6B35', '#F7931E', '#FFD23F', '#6BCF7F', '#4ECDC4'];

  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Users',
      value: '12,482',
      change: '+12%',
      trend: 'up',
      icon: <Users className="w-4 h-4" />
    },
    {
      title: 'Total Products',
      value: '1,856',
      change: '+8%',
      trend: 'up',
      icon: <Package className="w-4 h-4" />
    },
    {
      title: 'Total Orders',
      value: '8,947',
      change: '+23%',
      trend: 'up',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      title: 'Revenue',
      value: '$284,752',
      change: '+18%',
      trend: 'up',
      icon: <DollarSign className="w-4 h-4" />
    }
  ];

  const recentOrders = [
    {
      id: 'RK12345678',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 299.99,
      status: 'Delivered',
      date: '2024-01-15',
      items: 3
    },
    {
      id: 'RK12345679',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 159.99,
      status: 'Shipped',
      date: '2024-01-14',
      items: 2
    },
    {
      id: 'RK12345680',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      total: 89.99,
      status: 'Processing',
      date: '2024-01-13',
      items: 1
    },
    {
      id: 'RK12345681',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      total: 449.99,
      status: 'Pending',
      date: '2024-01-12',
      items: 5
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: '2024-01-15',
      orders: 12,
      spent: 1299.99,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinDate: '2024-01-14',
      orders: 8,
      spent: 899.99,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      joinDate: '2024-01-13',
      orders: 5,
      spent: 549.99,
      status: 'Inactive'
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      sku: 'IPH15PM001',
      sales: 247,
      revenue: 294530,
      stock: 45,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      sku: 'SGS24001',
      sales: 189,
      revenue: 151200,
      stock: 32,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      sku: 'MBP16001',
      sales: 124,
      revenue: 309620,
      stock: 18,
      category: 'Electronics'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Delivered': 'default',
      'Shipped': 'secondary',
      'Processing': 'outline',
      'Pending': 'destructive',
      'Active': 'default',
      'Inactive': 'secondary'
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  // Bulk operations handlers
  const handleSelectAllOrders = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(recentOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(topProducts.map(product => product.id.toString()));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(recentUsers.map(user => user.id.toString()));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkOrderAction = (action: string) => {
    console.log(`Bulk ${action} for orders:`, selectedOrders);
    // Implement bulk action logic
    setSelectedOrders([]);
  };

  const handleBulkProductAction = (action: string) => {
    console.log(`Bulk ${action} for products:`, selectedProducts);
    // Implement bulk action logic
    setSelectedProducts([]);
  };

  const handleBulkUserAction = (action: string) => {
    console.log(`Bulk ${action} for users:`, selectedUsers);
    // Implement bulk action logic
    setSelectedUsers([]);
  };

  const dismissAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <Package className="w-4 h-4" />;
      case 'order_pending': return <ShoppingCart className="w-4 h-4" />;
      case 'user_inactive': return <Users className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}! Here's what's happening with your store.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Alerts Section */}
          {showAlerts && alerts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Alerts & Notifications</h3>
                  <Badge variant="destructive">{alerts.length}</Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAlerts(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid gap-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border flex items-start gap-3 ${getAlertColor(alert.priority)}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      {alert.product && (
                        <p className="text-sm opacity-75 mt-1">Product: {alert.product}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => dismissAlert(alert.id)}
                      className="text-current hover:bg-current hover:bg-opacity-20 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {alerts.length > 3 && (
                  <Button variant="outline" size="sm" className="self-start">
                    View all {alerts.length} alerts
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">#{order.id}</div>
                          <div className="text-sm text-gray-600">{order.customer}</div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <div className="text-sm font-medium mt-1">${order.total}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Top Selling Products</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.sales} sales</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${product.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{product.stock} in stock</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle>Order Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedOrders.length > 0 && (
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-blue-800 font-medium">
                      {selectedOrders.length} order(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBulkOrderAction('mark_shipped')}>
                        <PackageCheck className="w-4 h-4 mr-2" />
                        Mark Shipped
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkOrderAction('mark_delivered')}>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Mark Delivered
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkOrderAction('send_email')}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedOrders([])} 
                        className="text-gray-600"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <button
                          onClick={() => handleSelectAllOrders(selectedOrders.length !== recentOrders.length)}
                          className="flex items-center justify-center w-full"
                        >
                          {selectedOrders.length === recentOrders.length ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : selectedOrders.length > 0 ? (
                            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            </div>
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className={selectedOrders.includes(order.id) ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <button
                            onClick={() => handleSelectOrder(order.id, !selectedOrders.includes(order.id))}
                            className="flex items-center justify-center w-full"
                          >
                            {selectedOrders.includes(order.id) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-gray-600">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="font-medium">${order.total}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Product Management
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      {topProducts.filter(p => p.stock < 20).length} Low Stock
                    </Badge>
                  </CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-800 font-medium">
                      {selectedProducts.length} product(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBulkProductAction('activate')}>
                        <PackageCheck className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkProductAction('deactivate')}>
                        <PackageX className="w-4 h-4 mr-2" />
                        Deactivate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkProductAction('update_stock')}>
                        <Package className="w-4 h-4 mr-2" />
                        Update Stock
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkProductAction('delete')} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedProducts([])} 
                        className="text-gray-600"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <button
                          onClick={() => handleSelectAllProducts(selectedProducts.length !== topProducts.length)}
                          className="flex items-center justify-center w-full"
                        >
                          {selectedProducts.length === topProducts.length ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : selectedProducts.length > 0 ? (
                            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            </div>
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id} className={selectedProducts.includes(product.id.toString()) ? 'bg-green-50' : ''}>
                        <TableCell>
                          <button
                            onClick={() => handleSelectProduct(product.id.toString(), !selectedProducts.includes(product.id.toString()))}
                            className="flex items-center justify-center w-full"
                          >
                            {selectedProducts.includes(product.id.toString()) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-2">
                          {product.name}
                          {product.stock < 20 && (
                            <AlertTriangle className="w-4 h-4 text-red-500" title="Low stock alert" />
                          )}
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock < 20 ? 'destructive' : 'outline'}>
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell className="font-medium">${product.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-purple-800 font-medium">
                      {selectedUsers.length} user(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBulkUserAction('activate')}>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkUserAction('deactivate')}>
                        <UserX className="w-4 h-4 mr-2" />
                        Deactivate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkUserAction('send_email')}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkUserAction('export')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedUsers([])} 
                        className="text-gray-600"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <button
                          onClick={() => handleSelectAllUsers(selectedUsers.length !== recentUsers.length)}
                          className="flex items-center justify-center w-full"
                        >
                          {selectedUsers.length === recentUsers.length ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : selectedUsers.length > 0 ? (
                            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            </div>
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id} className={selectedUsers.includes(user.id.toString()) ? 'bg-purple-50' : ''}>
                        <TableCell>
                          <button
                            onClick={() => handleSelectUser(user.id.toString(), !selectedUsers.includes(user.id.toString()))}
                            className="flex items-center justify-center w-full"
                          >
                            {selectedUsers.includes(user.id.toString()) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell className="font-medium">${user.spent}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* First Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Sales Trend (Last 12 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#FF6B35" 
                          fill="#FF6B35" 
                          fillOpacity={0.3}
                          name="Sales ($)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Sales by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value}%`, name]}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orders and Users Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Orders & Users Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="#F7931E" 
                          strokeWidth={3}
                          name="Orders"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#6BCF7F" 
                          strokeWidth={3}
                          name="New Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Weekly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="day" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Bar dataKey="revenue" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                      <p className="text-2xl font-bold">$156.32</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <ShoppingCart className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">+5.2% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">3.24%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">+0.8% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customer Lifetime Value</p>
                      <p className="text-2xl font-bold">$892.45</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">+12.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Return Rate</p>
                      <p className="text-2xl font-bold">2.8%</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <Package className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mt-2">-0.3% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
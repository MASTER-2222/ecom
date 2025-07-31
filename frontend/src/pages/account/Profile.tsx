import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, Settings, Package, MapPin, CreditCard, Bell, Shield, 
  LogOut, Edit, Save, X, Camera, Mail, Phone, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: '',
    gender: '',
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    security: true,
  });

  const handleSaveProfile = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const recentOrders = [
    {
      id: 'RK12345678',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: 3
    },
    {
      id: 'RK12345679',
      date: '2024-01-10',
      status: 'Shipped',
      total: 159.99,
      items: 2
    },
    {
      id: 'RK12345680',
      date: '2024-01-05',
      status: 'Processing',
      total: 89.99,
      items: 1
    }
  ];

  const savedAddresses = [
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      address: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      isDefault: false
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'Visa',
      last4: '1234',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '5678',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* User Info */}
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="text-lg">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  <Badge variant="outline" className="mt-2">
                    {user?.role}
                  </Badge>
                </div>

                <Separator className="mb-4" />

                {/* Navigation */}
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/account/${item.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname.includes(item.id) || (location.pathname === '/account' && item.id === 'profile')
                          ? 'bg-orange-100 text-orange-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                <Separator className="my-4" />

                {/* Logout */}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback className="text-xl">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                      )}
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Notification Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-sm text-gray-600">
                                {key === 'orderUpdates' && 'Receive updates about your orders'}
                                {key === 'promotions' && 'Get notified about special offers and deals'}
                                {key === 'newsletter' && 'Weekly newsletter with new products'}
                                {key === 'security' && 'Important security notifications'}
                              </div>
                            </div>
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) => 
                                setNotifications({ ...notifications, [key]: checked })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(order.date).toLocaleDateString()} • {order.items} items
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              order.status === 'Delivered' ? 'default' :
                              order.status === 'Shipped' ? 'secondary' : 'outline'
                            }>
                              {order.status}
                            </Badge>
                            <div className="font-medium mt-1">${order.total}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Saved Addresses</CardTitle>
                    <Button>
                      <MapPin className="w-4 h-4 mr-2" />
                      Add New Address
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((address) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{address.type}</Badge>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium">{address.name}</div>
                            <div className="text-sm text-gray-600">{address.address}</div>
                            <div className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Payment Methods</CardTitle>
                    <Button>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add New Card
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {method.type} ending in {method.last4}
                              </div>
                              <div className="text-sm text-gray-600">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-600">Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, MapPin, User, Lock, ArrowLeft, ArrowRight, 
  Truck, Shield, Clock, CheckCircle, AlertCircle, Phone, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  // Shipping Address
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),
  country: z.string().min(2, 'Country is required'),
  
  // Payment
  cardNumber: z.string().min(16, 'Valid card number is required'),
  expiryMonth: z.string().min(2, 'Month is required'),
  expiryYear: z.string().min(4, 'Year is required'),
  cvv: z.string().min(3, 'CVV is required'),
  cardName: z.string().min(2, 'Cardholder name is required'),
  
  // Billing
  billingAddressSame: z.boolean(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingCountry: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Get checkout data from location state or redirect if not available
  const checkoutData = location.state;
  
  useEffect(() => {
    if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
      navigate('/cart');
      toast.error('No items in checkout. Please add items to cart first.');
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [checkoutData, isAuthenticated, navigate]);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardName: '',
      billingAddressSame: true,
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZipCode: '',
      billingCountry: 'United States',
    },
  });

  const watchBillingAddressSame = form.watch('billingAddressSame');

  if (!checkoutData) {
    return null;
  }

  const { items, subtotal, tax, shipping, discount, total } = checkoutData;

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: shipping,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: shipping + 9.99,
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: shipping + 24.99,
      icon: <ArrowRight className="w-5 h-5" />
    }
  ];

  const handleStepChange = (step: number) => {
    if (step <= currentStep + 1) {
      setCurrentStep(step);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create order
      const orderData = {
        items: items.map((item: CartItem) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        },
        billingAddress: data.billingAddressSame ? {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        } : {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.billingAddress!,
          city: data.billingCity!,
          state: data.billingState!,
          zipCode: data.billingZipCode!,
          country: data.billingCountry!
        },
        paymentMethod: {
          type: paymentMethod,
          cardLast4: data.cardNumber.slice(-4)
        },
        shippingMethod,
        subtotal,
        tax,
        shipping: shippingOptions.find(opt => opt.id === shippingMethod)?.price || shipping,
        discount,
        total: total + (shippingOptions.find(opt => opt.id === shippingMethod)?.price || shipping) - shipping
      };

      // Clear cart and redirect to success
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { orderData } });
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: <MapPin className="w-5 h-5" /> },
    { id: 2, name: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
    { id: 3, name: 'Review', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/cart')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    currentStep >= step.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => handleStepChange(step.id)}
                >
                  {step.icon}
                  <span className="font-medium">{step.name}</span>
                  {currentStep > step.id && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-12 mx-2 ${
                    currentStep > step.id ? 'bg-orange-300' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Shipping Options */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Shipping Options</h3>
                        <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                          {shippingOptions.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id} className="flex items-center justify-between w-full cursor-pointer">
                                <div className="flex items-center gap-3">
                                  {option.icon}
                                  <div>
                                    <div className="font-medium">{option.name}</div>
                                    <div className="text-sm text-gray-600">{option.description}</div>
                                  </div>
                                </div>
                                <div className="font-medium">
                                  {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleNextStep} className="amazon-button">
                          Continue to Payment
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Payment Method Selection */}
                      <div>
                        <h3 className="font-semibold mb-3">Payment Method</h3>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                              <CreditCard className="w-4 h-4" />
                              Credit/Debit Card
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator />

                      {/* Card Information */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input placeholder="1234 5678 9012 3456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryMonth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Month</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {String(i + 1).padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="expiryYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="YYYY" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => (
                                      <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                                        {new Date().getFullYear() + i}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Billing Address */}
                      <div>
                        <FormField
                          control={form.control}
                          name="billingAddressSame"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Billing address is the same as shipping address
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        {!watchBillingAddressSame && (
                          <div className="mt-4 space-y-4">
                            <h3 className="font-semibold">Billing Address</h3>
                            <FormField
                              control={form.control}
                              name="billingAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123 Billing Street" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name="billingCity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input placeholder="New York" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingState"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Input placeholder="NY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingZipCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>ZIP Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="10001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevStep}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Shipping
                        </Button>
                        <Button onClick={handleNextStep} className="amazon-button">
                          Review Order
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Review Your Order
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold mb-4">Order Items</h3>
                        <div className="space-y-3">
                          {items.map((item: CartItem) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                              <img
                                src={item.product.thumbnail || '/api/placeholder/80/80'}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.product.title}</h4>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Shipping Information */}
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Information</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p>{form.getValues('firstName')} {form.getValues('lastName')}</p>
                          <p>{form.getValues('address')}</p>
                          <p>{form.getValues('city')}, {form.getValues('state')} {form.getValues('zipCode')}</p>
                          <p>{form.getValues('country')}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Payment Information */}
                      <div>
                        <h3 className="font-semibold mb-2">Payment Information</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p>**** **** **** {form.getValues('cardNumber').slice(-4)}</p>
                          <p>{form.getValues('cardName')}</p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevStep}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Payment
                        </Button>
                        <Button
                          type="submit"
                          disabled={isProcessing}
                          className="amazon-button"
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Place Order
                            </div>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </form>
            </Form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingOptions.find(opt => opt.id === shippingMethod)?.price === 0 
                      ? 'FREE' 
                      : `$${(shippingOptions.find(opt => opt.id === shippingMethod)?.price || shipping).toFixed(2)}`
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${(total + (shippingOptions.find(opt => opt.id === shippingMethod)?.price || shipping) - shipping).toFixed(2)}
                  </span>
                </div>

                {/* Security Features */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span>Protected payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-orange-600" />
                    <span>Tracked delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
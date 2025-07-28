import React, { useState } from 'react';
import { 
  Check, XCircle, Clock, Calendar, Search, Filter, ArrowUp, ArrowDown, Eye 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getBookingsByProvider } from '../../services/bookingApi';
import { format } from 'date-fns';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await getBookingsByProvider();
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-50 text-success-700';
      case 'cancelled':
        return 'bg-error-50 text-error-700';
      case 'pending':
        return 'bg-warning-50 text-warning-700';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-50 text-success-700';
      case 'partial':
        return 'bg-warning-50 text-warning-700';
      case 'pending':
        return 'bg-error-50 text-error-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
  
  const filteredBookings = bookings
    .filter(booking => {
      const mandapName = booking.mandapId?.mandapName || '';
      const customerName = booking.userId?.name || '';
      const customerEmail = booking.userId?.email || '';
      
      const matchesSearch = mandapName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === 'all') return matchesSearch;
      if (filter === booking.paymentStatus) return matchesSearch;
      if (filter === `payment-${booking.paymentStatus}`) return matchesSearch;
      
      return false;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'userId.name':
          comparison = (a.userId?.name || '').localeCompare(b.userId?.name || '');
          break;
        case 'mandapId.mandapName':
          comparison = (a.mandapId?.mandapName || '').localeCompare(b.mandapId?.mandapName || '');
          break;
        case 'totalAmount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  const handleViewDetails = (id: string) => {
    console.log(`View booking details: ${id}`);
    // In a real app, this would navigate to a booking details page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search by mandap, customer name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select
              options={[
                { value: 'all', label: 'All Bookings' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'payment-completed', label: 'Payment - Completed' },
                { value: 'payment-partial', label: 'Payment - Partial' },
                { value: 'payment-pending', label: 'Payment - Pending' },
              ]}
              value={filter}
              onChange={setFilter}
              fullWidth
              icon={<Filter className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                  <th 
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('mandapId.mandapName')}
                  >
                    <div className="flex items-center">
                      Mandap
                      {sortIcon('mandapId.mandapName')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('userId.name')}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortIcon('userId.name')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Booking Date
                      {sortIcon('createdAt')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortIcon('totalAmount')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Payment</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">#{booking.id}</td>
                    <td className="px-4 py-4">{booking.mandapId?.mandapName || 'N/A'}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">{booking.userId?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{booking.userId?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{format(new Date(booking.createdAt), 'dd MMM yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium">₹{booking.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('confirmed')}`}>
                        {getStatusIcon('confirmed')}
                        <span className="ml-1 capitalize">Confirmed</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        <span className="capitalize">{booking.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(booking._id)}
                        icon={<Eye className="h-4 w-4" />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filter !== 'all' ? 'Try a different search or filter' : 'Your bookings will appear here'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
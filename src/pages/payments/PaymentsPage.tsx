import React, { useState } from 'react';
import { 
  DollarSign, Search, Filter, ArrowUp, ArrowDown, Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getBookingsByProvider } from '../../services/bookingApi';
import { format } from 'date-fns';

const PaymentsPage: React.FC = () => {
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
  
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-success-50 text-success-700';
      case 'Partial':
        return 'bg-warning-50 text-warning-700';
      case 'Pending':
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
  
  // Calculate total received payments
  const totalReceived = bookings.reduce((sum, booking) => {
    if (booking.paymentStatus === 'Completed') {
      return sum + booking.amountPaid;
    } else if (booking.paymentStatus === 'Partial') {
      return sum + booking.amountPaid;
    }
    return sum;
  }, 0);
  
  // Calculate total pending payments
  const totalPending = bookings.reduce((sum, booking) => {
    if (booking.paymentStatus === 'Pending') {
      return sum + booking.totalAmount;
    } else if (booking.paymentStatus === 'Partial') {
      return sum + (booking.totalAmount - booking.amountPaid);
    }
    return sum;
  }, 0);
  
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
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-4 bg-success-50 rounded-full mr-4">
              <DollarSign className="h-8 w-8 text-success-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Received</p>
              <h3 className="text-2xl font-semibold text-gray-900">₹{totalReceived.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-4 bg-warning-50 rounded-full mr-4">
              <DollarSign className="h-8 w-8 text-warning-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pending</p>
              <h3 className="text-2xl font-semibold text-gray-900">₹{totalPending.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
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
                { value: 'all', label: 'All Payments' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Partial', label: 'Partial' },
                { value: 'Pending', label: 'Pending' },
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
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Payment Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">#{booking._id?.slice(-6)}</td>
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        <span className="capitalize">{booking.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {booking.paymentStatus !== 'Completed' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<DollarSign className="h-4 w-4" />}
                        >
                          Record Payment
                        </Button>
                      )}
                      {booking.paymentStatus === 'Completed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<DollarSign className="h-4 w-4" />}
                        >
                          View Receipt
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No payments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filter !== 'all' ? 'Try a different search or filter' : 'Your payments will appear here'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
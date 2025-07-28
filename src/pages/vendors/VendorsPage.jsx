import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Camera, Utensils, Bed, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getAllCaterers } from '../../services/catererApi';
import { getAllPhotographers } from '../../services/photographerApi';
import { getAllRooms } from '../../services/roomApi';

const VendorsPage = () => {
  const [caterers, setCaterers] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const [caterersData, photographersData, roomsData] = await Promise.all([
        getAllCaterers(),
        getAllPhotographers(),
        getAllRooms()
      ]);
      
      setCaterers(caterersData);
      setPhotographers(photographersData);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (type, id) => {
    // Implement delete functionality
    console.log(`Delete ${type} with id: ${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="p-4 bg-primary-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Utensils className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Caterers</h3>
          <p className="text-3xl font-bold text-primary-600 mb-2">{caterers.length}</p>
          <p className="text-sm text-gray-500">Active caterers</p>
          <div className="mt-4">
            <Link to="/vendors/caterers/new">
              <Button variant="outline" size="sm" fullWidth>
                Add Caterer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="p-4 bg-primary-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Camera className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Photographers</h3>
          <p className="text-3xl font-bold text-primary-600 mb-2">{photographers.length}</p>
          <p className="text-sm text-gray-500">Active photographers</p>
          <div className="mt-4">
            <Link to="/vendors/photographers/new">
              <Button variant="outline" size="sm" fullWidth>
                Add Photographer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="p-4 bg-primary-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bed className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Rooms</h3>
          <p className="text-3xl font-bold text-primary-600 mb-2">{rooms.length}</p>
          <p className="text-sm text-gray-500">Active rooms</p>
          <div className="mt-4">
            <Link to="/vendors/rooms/new">
              <Button variant="outline" size="sm" fullWidth>
                Add Room
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCaterers = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caterers.map((caterer) => (
        <Card key={caterer._id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-primary-50 rounded-full mr-3">
                  <Utensils className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{caterer.catererName}</h3>
                  <p className="text-sm text-gray-500">Food Type: {caterer.foodType}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/vendors/caterers/${caterer._id}/edit`}>
                  <Button variant="ghost" size="sm" icon={<Edit className="h-4 w-4" />} />
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleDelete('caterer', caterer._id)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mandap:</span> {caterer.mandapId?.mandapName || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span> {caterer.menuCategory?.category || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Price per Plate:</span> ₹{caterer.menuCategory?.pricePerPlate || 0}
              </p>
              {caterer.hasTastingSession && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tasting Available
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPhotographers = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photographers.map((photographer) => (
        <Card key={photographer._id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-primary-50 rounded-full mr-3">
                  <Camera className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{photographer.photographerName}</h3>
                  <p className="text-sm text-gray-500">
                    {photographer.photographyTypes?.length || 0} Services
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/vendors/photographers/${photographer._id}/edit`}>
                  <Button variant="ghost" size="sm" icon={<Edit className="h-4 w-4" />} />
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleDelete('photographer', photographer._id)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mandap:</span> {photographer.mandapId?.mandapName || 'N/A'}
              </p>
              {photographer.photographyTypes?.map((type, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <span className="font-medium">{type.phtype}:</span> ₹{type.pricePerEvent}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderRooms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <Card key={room._id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-primary-50 rounded-full mr-3">
                  <Bed className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Room Facility</h3>
                  <p className="text-sm text-gray-500">{room.mandapId?.mandapName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/vendors/rooms/${room._id}/edit`}>
                  <Button variant="ghost" size="sm" icon={<Edit className="h-4 w-4" />} />
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleDelete('room', room._id)}
                />
              </div>
            </div>
            <div className="space-y-2">
              {room.AcRoom && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">AC Rooms:</span> {room.AcRoom.noOfRooms} rooms @ ₹{room.AcRoom.pricePerNight}/night
                </div>
              )}
              {room.NonAcRoom && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Non-AC Rooms:</span> {room.NonAcRoom.noOfRooms} rooms @ ₹{room.NonAcRoom.pricePerNight}/night
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'caterers':
        return renderCaterers();
      case 'photographers':
        return renderPhotographers();
      case 'rooms':
        return renderRooms();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/vendors/caterers/new">
            <Button icon={<Plus className="h-4 w-4" />} size="sm">
              Add Caterer
            </Button>
          </Link>
          <Link to="/vendors/photographers/new">
            <Button icon={<Plus className="h-4 w-4" />} size="sm" variant="secondary">
              Add Photographer
            </Button>
          </Link>
          <Link to="/vendors/rooms/new">
            <Button icon={<Plus className="h-4 w-4" />} size="sm" variant="outline">
              Add Room
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('caterers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'caterers'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Caterers ({caterers.length})
        </button>
        <button
          onClick={() => setActiveTab('photographers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'photographers'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Photographers ({photographers.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'rooms'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Rooms ({rooms.length})
        </button>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default VendorsPage;
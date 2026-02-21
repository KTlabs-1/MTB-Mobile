import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';

const LOCATIONS = ['Dundalk', 'Drogheda', 'Dublin'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ today: 0, week: 0, revenue: 0, pending: 0 });
  const [todayBookings, setTodayBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  const [isLoading, setIsLoading] = useState(true);

  // Schedule state
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [settingWeek, setSettingWeek] = useState(null);

  // Check if user is admin
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/signin');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(userData);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [statsData, todayData, allData] = await Promise.all([
        adminApi.getBookingStats(),
        adminApi.getTodayBookings(),
        adminApi.getAllBookings()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (todayData.success) setTodayBookings(todayData.bookings);
      if (allData.success) setAllBookings(allData.bookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedules = async () => {
    setSchedulesLoading(true);
    try {
      const data = await adminApi.getSchedules();
      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setSchedulesLoading(false);
    }
  };

  // Fetch schedules when switching to schedule tab
  useEffect(() => {
    if (activeTab === 'schedule') {
      fetchSchedules();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const handleStatusChange = async (bookingRef, newStatus) => {
    try {
      const result = await adminApi.updateBookingStatus(bookingRef, newStatus);
      if (result.success) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSetSchedule = async (weekStart, location) => {
    setScheduleError('');
    setScheduleSuccess('');
    setSettingWeek(weekStart);

    try {
      const result = await adminApi.setSchedule(weekStart, location);
      if (result.success) {
        let msg = result.updated
          ? `Schedule updated to ${location}`
          : `Schedule set to ${location}`;
        if (result.affectedBookings > 0) {
          msg += ` — ${result.affectedBookings} booking(s) were cancelled and customers notified.`;
        }
        setScheduleSuccess(msg);
        fetchSchedules();
        // Also refresh booking stats since bookings may have been cancelled
        fetchDashboardData();
      } else {
        setScheduleError(result.message || 'Failed to set schedule');
      }
    } catch (error) {
      setScheduleError('Error setting schedule');
    } finally {
      setSettingWeek(null);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    setScheduleError('');
    setScheduleSuccess('');

    try {
      const result = await adminApi.deleteSchedule(id);
      if (result.success) {
        setScheduleSuccess('Schedule deleted');
        fetchSchedules();
      } else {
        setScheduleError(result.message || 'Failed to delete schedule');
      }
    } catch (error) {
      setScheduleError('Error deleting schedule');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatWeekRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts = { day: 'numeric', month: 'short' };
    return `${s.toLocaleDateString('en-IE', opts)} — ${e.toLocaleDateString('en-IE', opts)}`;
  };

  // Generate upcoming weeks (this week + next 3)
  const getUpcomingWeeks = () => {
    const weeks = [];
    const today = new Date();

    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i * 7);

      // Get Monday
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      monday.setHours(0, 0, 0, 0);

      // Get Sunday
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      // Check if this week already has a schedule
      const existing = schedules.find((s) => {
        const sStart = new Date(s.weekStart);
        sStart.setHours(0, 0, 0, 0);
        return sStart.getTime() === monday.getTime();
      });

      let label = 'Week';
      if (i === 0) label = 'This Week';
      else if (i === 1) label = 'Next Week';
      else label = `In ${i} Weeks`;

      weeks.push({
        label,
        weekStart: monday.toISOString(),
        weekEnd: sunday.toISOString(),
        existing
      });
    }

    return weeks;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-brand-red" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const upcomingWeeks = activeTab === 'schedule' ? getUpcomingWeeks() : [];

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-dark border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="font-heading text-2xl text-white">
              MTB <span className="text-brand-red">ADMIN</span>
            </h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.firstName}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-400 hover:text-white border border-white/10 rounded-sm
                         hover:border-white/20 transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Today */}
          <div className="bg-brand-surface border border-white/10 rounded-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-red/20 rounded-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-heading text-white">{stats.today}</p>
                <p className="text-gray-500 text-sm">Today</p>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className="bg-brand-surface border border-white/10 rounded-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-heading text-white">{stats.week}</p>
                <p className="text-gray-500 text-sm">This Week</p>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-brand-surface border border-white/10 rounded-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-heading text-white">&euro;{stats.revenue}</p>
                <p className="text-gray-500 text-sm">Revenue</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-brand-surface border border-white/10 rounded-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-heading text-white">{stats.pending}</p>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-3 font-medium text-sm uppercase tracking-wider rounded-sm transition-all whitespace-nowrap
              ${activeTab === 'today' ? 'bg-brand-red text-white' : 'bg-brand-surface text-gray-400 hover:text-white border border-white/10'}`}
          >
            Today's Schedule
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-medium text-sm uppercase tracking-wider rounded-sm transition-all whitespace-nowrap
              ${activeTab === 'all' ? 'bg-brand-red text-white' : 'bg-brand-surface text-gray-400 hover:text-white border border-white/10'}`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-medium text-sm uppercase tracking-wider rounded-sm transition-all whitespace-nowrap
              ${activeTab === 'schedule' ? 'bg-brand-red text-white' : 'bg-brand-surface text-gray-400 hover:text-white border border-white/10'}`}
          >
            Weekly Schedule
          </button>
        </div>

        {/* Today's Schedule */}
        {activeTab === 'today' && (
          <div>
            <h2 className="font-heading text-xl text-white mb-4">
              Today's Schedule &mdash; {new Date().toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>

            {todayBookings.length === 0 ? (
              <div className="bg-brand-surface border border-white/10 rounded-sm p-12 text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">No bookings scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayBookings.map((booking) => (
                  <div key={booking.bookingRef} className="bg-brand-surface border border-white/10 rounded-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-[80px]">
                          <p className="text-2xl font-heading text-brand-red">{booking.time}</p>
                        </div>
                        <div>
                          <p className="text-white font-heading text-lg">{booking.customer.name}</p>
                          <p className="text-gray-400">{booking.service.name} &mdash; &euro;{booking.service.price}</p>
                          <p className="text-gray-500 text-sm">{booking.customer.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={`tel:${booking.customer.phone}`}
                          className="p-2 bg-green-500/20 text-green-500 rounded-sm hover:bg-green-500/30 transition-colors"
                          title="Call customer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>

                        <span className={`px-3 py-1 rounded-sm text-xs uppercase tracking-wider
                          ${booking.status === 'confirmed' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                          ${booking.status === 'completed' ? 'bg-green-500/20 text-green-500' : ''}
                          ${booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : ''}
                          ${booking.status === 'pending' ? 'bg-blue-500/20 text-blue-500' : ''}
                        `}>
                          {booking.status}
                        </span>

                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.bookingRef, 'completed')}
                            className="px-4 py-2 bg-green-500 text-white text-sm rounded-sm hover:bg-green-600 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Bookings */}
        {activeTab === 'all' && (
          <div>
            <h2 className="font-heading text-xl text-white mb-4">All Bookings</h2>

            {allBookings.length === 0 ? (
              <div className="bg-brand-surface border border-white/10 rounded-sm p-12 text-center">
                <p className="text-gray-500">No bookings yet</p>
              </div>
            ) : (
              <div className="bg-brand-surface border border-white/10 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Ref</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Date</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Time</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Service</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Location</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left p-4 text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings.map((booking) => (
                        <tr key={booking.bookingRef} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-brand-red font-mono text-sm">{booking.bookingRef}</td>
                          <td className="p-4 text-white text-sm">{formatDate(booking.date)}</td>
                          <td className="p-4 text-white text-sm">{booking.time}</td>
                          <td className="p-4">
                            <p className="text-white text-sm">{booking.customer.name}</p>
                            <p className="text-gray-500 text-xs">{booking.customer.phone}</p>
                          </td>
                          <td className="p-4 text-gray-300 text-sm">{booking.service.name}</td>
                          <td className="p-4 text-gray-300 text-sm">{booking.location || '—'}</td>
                          <td className="p-4 text-white text-sm">&euro;{booking.service.price}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-sm text-xs uppercase tracking-wider
                              ${booking.status === 'confirmed' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                              ${booking.status === 'completed' ? 'bg-green-500/20 text-green-500' : ''}
                              ${booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : ''}
                              ${booking.status === 'pending' ? 'bg-blue-500/20 text-blue-500' : ''}
                            `}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {booking.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(booking.bookingRef, 'completed')}
                                    className="p-2 bg-green-500/20 text-green-500 rounded-sm hover:bg-green-500/30 transition-colors"
                                    title="Mark Complete"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(booking.bookingRef, 'cancelled')}
                                    className="p-2 bg-red-500/20 text-red-500 rounded-sm hover:bg-red-500/30 transition-colors"
                                    title="Cancel"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Weekly Schedule Management */}
        {activeTab === 'schedule' && (
          <div>
            <h2 className="font-heading text-xl text-white mb-4">Weekly Schedule Management</h2>
            <p className="text-gray-400 mb-6">Set which location you'll be in each week. Customers can only book when a schedule is set for their area.</p>

            {/* Success/Error Messages */}
            {scheduleSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4 mb-6">
                <p className="text-green-400 text-sm">{scheduleSuccess}</p>
              </div>
            )}
            {scheduleError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 mb-6">
                <p className="text-red-400 text-sm">{scheduleError}</p>
              </div>
            )}

            {schedulesLoading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-brand-red" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingWeeks.map((week, index) => (
                  <div key={index} className="bg-brand-surface border border-white/10 rounded-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading text-lg text-white">{week.label}</h3>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-brand-red/20 text-brand-red text-xs uppercase tracking-wider rounded-sm">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{formatWeekRange(week.weekStart, week.weekEnd)}</p>
                      </div>

                      {week.existing && (
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-2 bg-brand-red/20 text-brand-red font-heading text-sm rounded-sm">
                            {week.existing.location}
                          </span>
                          <button
                            onClick={() => handleDeleteSchedule(week.existing._id)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                            title="Remove schedule"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {!week.existing && (
                        <span className="text-gray-600 text-sm italic">Not set</span>
                      )}
                    </div>

                    {/* Location Selection */}
                    <div className="flex flex-wrap gap-3">
                      {LOCATIONS.map((location) => {
                        const isCurrentLocation = week.existing?.location === location;
                        const isSetting = settingWeek === week.weekStart;

                        return (
                          <button
                            key={location}
                            onClick={() => {
                              if (isCurrentLocation) return;
                              if (week.existing) {
                                const confirmed = window.confirm(
                                  `Change location from ${week.existing.location} to ${location}? Any existing bookings for this week will be cancelled and customers will be notified.`
                                );
                                if (!confirmed) return;
                              }
                              handleSetSchedule(week.weekStart, location);
                            }}
                            disabled={isSetting}
                            className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-all
                              ${isCurrentLocation
                                ? 'bg-brand-red text-white cursor-default'
                                : 'bg-brand-dark text-gray-400 border border-white/10 hover:text-white hover:border-brand-red/50'
                              }
                              ${isSetting ? 'opacity-50 cursor-wait' : ''}
                            `}
                          >
                            {isSetting ? (
                              <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Setting...
                              </span>
                            ) : (
                              location
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

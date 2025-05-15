import { Component, createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user';
import { ApexOptions } from 'apexcharts';
import { SolidApexCharts as Chart } from 'solid-apexcharts';
import styles from './Charts.module.css';
import { Show } from 'solid-js';

// Sample data matching our database design
const sampleReservations = [
  {
    id: '1',
    date: '2024-02-20T11:00:00',
    status: 'CONFIRMED',
    guest: {
      id: 'g1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    numberOfGuests: 2,
    specialRequests: 'Window seat preferred'
  },
  {
    id: '2',
    date: '2024-02-20T12:00:00',
    status: 'PENDING',
    guest: {
      id: 'g2',
      name: 'Emma Johnson',
      email: 'emma@example.com',
      phone: '+1987654321'
    },
    numberOfGuests: 4,
    specialRequests: 'High chair needed'
  },
  {
    id: '3',
    date: '2024-02-20T13:00:00',
    status: 'CONFIRMED',
    guest: {
      id: 'g3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1122334455'
    },
    numberOfGuests: 2,
    specialRequests: 'Allergic to nuts'
  },
  {
    id: '4',
    date: '2024-02-21T11:00:00',
    status: 'CANCELLED',
    guest: {
      id: 'g4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1555666777'
    },
    numberOfGuests: 3,
    specialRequests: 'Birthday celebration'
  },
  {
    id: '5',
    date: '2024-02-21T12:00:00',
    status: 'CONFIRMED',
    guest: {
      id: 'g5',
      name: 'David Lee',
      email: 'david@example.com',
      phone: '+1888999000'
    },
    numberOfGuests: 2,
    specialRequests: 'Anniversary dinner'
  },
  {
    id: '6',
    date: '2024-02-21T13:00:00',
    status: 'CONFIRMED',
    guest: {
      id: 'g6',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1777888999'
    },
    numberOfGuests: 5,
    specialRequests: 'Business meeting'
  },
  {
    id: '7',
    date: '2024-02-22T11:00:00',
    status: 'PENDING',
    guest: {
      id: 'g7',
      name: 'Robert Taylor',
      email: 'robert@example.com',
      phone: '+1666777888'
    },
    numberOfGuests: 2,
    specialRequests: 'Vegetarian options needed'
  },
  {
    id: '8',
    date: '2024-02-22T12:00:00',
    status: 'CONFIRMED',
    guest: {
      id: 'g8',
      name: 'Jennifer Martinez',
      email: 'jennifer@example.com',
      phone: '+1444555666'
    },
    numberOfGuests: 3,
    specialRequests: 'Gluten-free menu'
  },
  {
    id: '9',
    date: '2024-02-22T13:00:00',
    status: 'CONFIRMED',
    guest: {
      id: 'g9',
      name: 'William Garcia',
      email: 'william@example.com',
      phone: '+1333444555'
    },
    numberOfGuests: 4,
    specialRequests: 'Outdoor seating preferred'
  },
  {
    id: '10',
    date: '2024-02-23T11:00:00',
    status: 'CANCELLED',
    guest: {
      id: 'g10',
      name: 'Patricia Robinson',
      email: 'patricia@example.com',
      phone: '+1222333444'
    },
    numberOfGuests: 2,
    specialRequests: 'Quiet table requested'
  },
  {
    id: '11',
    date: '2024-02-23T12:00:00',
    status: 'CONFIRMED',
    guest: {
      id: 'g11',
      name: 'James Clark',
      email: 'james@example.com',
      phone: '+1111222333'
    },
    numberOfGuests: 6,
    specialRequests: 'Family reunion'
  },
  {
    id: '12',
    date: '2024-02-23T13:00:00',
    status: 'PENDING',
    guest: {
      id: 'g12',
      name: 'Elizabeth White',
      email: 'elizabeth@example.com',
      phone: '+1999888777'
    },
    numberOfGuests: 2,
    specialRequests: 'Wheelchair accessible table'
  }
];

const Charts: Component = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(true);

  // Redirect if not an employee
  if (user()?.role !== UserRole.EMPLOYEE) {
    navigate('/home');
    return null;
  }

  onMount(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1000);
  });

  // Process data for daily trends
  const getDailyTrendsData = () => {
    const dailyCounts = sampleReservations.reduce((acc, reservation) => {
      const date = new Date(reservation.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      categories: Object.keys(dailyCounts),
      series: [{
        name: 'Reservations',
        data: Object.values(dailyCounts)
      }]
    };
  };

  // Process data for status distribution
  const getStatusDistributionData = () => {
    const statusCounts = sampleReservations.reduce((acc, reservation) => {
      acc[reservation.status] = (acc[reservation.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts),
      series: Object.values(statusCounts)
    };
  };

  // Process data for time slots
  const getTimeSlotData = () => {
    const timeSlotCounts = sampleReservations.reduce((acc, reservation) => {
      const hour = new Date(reservation.date).getHours();
      const timeSlot = `${hour}:00`;
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      categories: Object.keys(timeSlotCounts),
      series: [{
        name: 'Reservations',
        data: Object.values(timeSlotCounts)
      }]
    };
  };

  const dailyTrendsOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    title: {
      text: 'Daily Reservation Trends',
      align: 'left'
    },
    xaxis: {
      categories: getDailyTrendsData().categories
    },
    yaxis: {
      title: {
        text: 'Number of Reservations'
      }
    }
  };

  const statusDistributionOptions: ApexOptions = {
    chart: {
      type: 'donut'
    },
    title: {
      text: 'Reservation Status Distribution',
      align: 'left'
    },
    labels: getStatusDistributionData().labels,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const timeSlotOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    title: {
      text: 'Popular Time Slots',
      align: 'left'
    },
    xaxis: {
      categories: getTimeSlotData().categories
    },
    yaxis: {
      title: {
        text: 'Number of Reservations'
      }
    }
  };

  return (
    <div class={styles.charts}>
      <h1>Reservation Analytics</h1>
      <Show
        when={!loading()}
        fallback={<div class={styles.loading}>Loading charts...</div>}
      >
        <div class={styles.chartGrid}>
          <div class={styles.chartContainer}>
            <Chart
              options={dailyTrendsOptions}
              series={getDailyTrendsData().series}
              type="line"
              height={350}
            />
          </div>
          <div class={styles.chartContainer}>
            <Chart
              options={statusDistributionOptions}
              series={getStatusDistributionData().series}
              type="donut"
              height={350}
            />
          </div>
          <div class={styles.chartContainer}>
            <Chart
              options={timeSlotOptions}
              series={getTimeSlotData().series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Charts; 
// Dashboard Application JavaScript

// Data from the application (matching provided structure exactly)
const dashboardData = {
  daily_data: [
    {
      date: "23/07/2025",
      total: 735,
      rangel: 272,
      rfa: 0,
      manychat: 394,
      strategy: "Lançamento + Manychat"
    },
    {
      date: "27/07/2025",
      total: 415,
      rangel: 388,
      rfa: 0,
      manychat: 0,
      strategy: "Pesquisa Interativa"
    },
    {
      date: "24/07/2025",
      total: 326,
      rangel: 172,
      rfa: 0,
      manychat: 0,
      strategy: "Educativo Noturno"
    },
    {
      date: "11/08/2025",
      total: 253,
      rangel: 0,
      rfa: 145,
      manychat: 0,
      strategy: "Pesquisa + Poatan"
    },
    {
      date: "03/08/2025",
      total: 238,
      rangel: 0,
      rfa: 0,
      manychat: 186,
      strategy: "Live Tailândia"
    }
  ],
  
  metrics: {
    total_leads: 3680,
    stories_rangel: 1707,
    stories_rfa: 423,
    best_strategy: "27/07",
    best_strategy_leads: 415
  },

  hourly_conversion: {
    "06:00-08:00": 18.5,
    "08:00-10:00": 14.2,
    "10:00-12:00": 11.8,
    "12:00-14:00": 8.9,
    "14:00-16:00": 7.5,
    "16:00-18:00": 13.2,
    "18:00-20:00": 21.7,
    "20:00-22:00": 16.8
  },

  utm_sources: {
    stories_rangel: {
      name: "STORIES RANGEL",
      total: 1707,
      emoji: "🥇",
      percentage: 46.4
    },
    manychat: {
      name: "MANYCHAT",
      total: 580,
      emoji: "🥈",
      percentage: 15.8
    },
    acadrfa: {
      name: "ACADRFA",
      total: 423,
      emoji: "🥉",
      percentage: 11.5
    }
  },

  insights: [
    "Horário de Ouro: 11h-11h30 com 415 leads em uma única estratégia",
    "Melhor Formato: Pesquisa interativa + CTA imediato (27/07)",
    "Volume Máximo: Estratégia de lançamento completo (23/07)",
    "Autoridade Externa: Conteúdo Tailândia + Poatan geraram 433 leads",
    "Lives Noturnas: 18h mostrou-se horário efetivo para educativo"
  ]
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Current filter state
let currentFilter = 'all';

// Chart instances for proper cleanup
let charts = {
  timeline: null,
  hour: null,
  utm: null
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
  initializeTimelineEvents();
  initializeCharts();
  initializeFilters();
});

// Tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      switchToTab(targetTab);
    });
  });

  // Initialize the first tab content
  setTimeout(() => {
    updateHourSlotsDisplay();
  }, 100);
}

// Initialize timeline events
function initializeTimelineEvents() {
  const timelineContainer = document.getElementById('timeline-events');
  
  dashboardData.daily_data.forEach(item => {
    const eventElement = document.createElement('div');
    eventElement.className = 'timeline-event';
    eventElement.innerHTML = `
      <div class="event-date">${item.date}</div>
      <div class="event-description">
        <strong>${item.strategy}</strong><br>
        <small>Rangel: ${item.rangel} | RFA: ${item.rfa} | Manychat: ${item.manychat}</small>
      </div>
      <div class="event-leads">${item.total} leads</div>
    `;
    timelineContainer.appendChild(eventElement);
  });
}

// Initialize filters
function initializeFilters() {
  const profileFilter = document.getElementById('profile-filter');
  
  profileFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    updateTimelineChart();
  });
}

// Initialize all charts
function initializeCharts() {
  // Initialize charts with a delay to ensure DOM is ready
  setTimeout(() => {
    // Only initialize timeline chart as it's the default active tab
    // Other charts will be initialized when their tabs are clicked
    console.log('Charts initialization ready');
  }, 100);
}

// Create timeline chart
function createTimelineChart() {
  const ctx = document.getElementById('timeline-chart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (charts.timeline) {
    charts.timeline.destroy();
  }

  const labels = dashboardData.daily_data.map(item => item.date);
  const datasets = [];
  
  if (currentFilter === 'all' || currentFilter === 'rangel') {
    datasets.push({
      label: 'Stories Rangel',
      data: dashboardData.daily_data.map(item => item.rangel),
      borderColor: chartColors[0],
      backgroundColor: chartColors[0] + '20',
      tension: 0.4,
      fill: false
    });
  }
  
  if (currentFilter === 'all' || currentFilter === 'rfa') {
    datasets.push({
      label: 'Stories RFA',
      data: dashboardData.daily_data.map(item => item.rfa),
      borderColor: chartColors[1],
      backgroundColor: chartColors[1] + '20',
      tension: 0.4,
      fill: false
    });
  }
  
  if (currentFilter === 'all') {
    datasets.push({
      label: 'Manychat',
      data: dashboardData.daily_data.map(item => item.manychat),
      borderColor: chartColors[2],
      backgroundColor: chartColors[2] + '20',
      tension: 0.4,
      fill: false
    });
  }

  charts.timeline = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Evolução Diária de Leads por Fonte'
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de Leads'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Data'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

// Update timeline chart based on filter
function updateTimelineChart() {
  createTimelineChart();
}

// Create hour analysis chart
function createHourChart() {
  const ctx = document.getElementById('hour-chart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (charts.hour) {
    charts.hour.destroy();
  }

  const hourSlots = Object.keys(dashboardData.hourly_conversion);
  const conversionData = Object.values(dashboardData.hourly_conversion);

  charts.hour = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hourSlots,
      datasets: [
        {
          label: 'Taxa de Conversão (%)',
          data: conversionData,
          backgroundColor: chartColors[0],
          borderColor: chartColors[0],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Taxa de Conversão por Faixa Horária'
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Taxa de Conversão (%)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Faixa Horária'
          }
        }
      }
    }
  });
}

// Create UTM ranking chart
function createUTMChart() {
  const ctx = document.getElementById('utm-chart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (charts.utm) {
    charts.utm.destroy();
  }

  const utmSources = Object.keys(dashboardData.utm_sources);
  const utmData = utmSources.map(source => dashboardData.utm_sources[source].total);
  const utmLabels = utmSources.map(source => dashboardData.utm_sources[source].name);

  charts.utm = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: utmLabels,
      datasets: [{
        label: 'Leads por Fonte UTM',
        data: utmData,
        backgroundColor: [chartColors[0], chartColors[1], chartColors[2]],
        borderColor: [chartColors[0], chartColors[1], chartColors[2]],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Distribuição de Leads por Fonte UTM'
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ${context.raw} leads (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Utility function to format numbers
function formatNumber(num) {
  return new Intl.NumberFormat('pt-BR').format(num);
}

// Utility function to format dates
function formatDate(dateStr) {
  return dateStr;
}

// Additional helper functions
function calculateLeadsForHour(hourSlot) {
  const conversion = dashboardData.hourly_conversion[hourSlot];
  // Calculate approximate leads based on conversion rate
  return Math.round((conversion / 21.7) * 189); // Using max values as reference
}

// Update hour slots with calculated leads
function updateHourSlotsDisplay() {
  const hourSlots = document.querySelectorAll('.hour-slot');
  const hourKeys = Object.keys(dashboardData.hourly_conversion);
  
  hourSlots.forEach((slot, index) => {
    if (hourKeys[index]) {
      const hourKey = hourKeys[index];
      const conversion = dashboardData.hourly_conversion[hourKey];
      const leads = calculateLeadsForHour(hourKey);
      
      // Update conversion rate
      const conversionEl = slot.querySelector('.conversion-rate');
      if (conversionEl) conversionEl.textContent = `${conversion}%`;
      
      // Update leads count
      const leadsEl = slot.querySelector('.leads-count');
      if (leadsEl) leadsEl.textContent = `${leads} leads`;
      
      // Update performance bar
      const barFill = slot.querySelector('.bar-fill');
      if (barFill) {
        const percentage = Math.round((conversion / 21.7) * 100);
        barFill.style.width = `${percentage}%`;
      }
    }
  });
}

// Enhanced tab switching with proper chart reinitialization
function switchToTab(tabId) {
  // Remove active class from all buttons and panels
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  // Add active class to clicked button and corresponding panel
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
  
  // Initialize charts with delay for proper rendering
  setTimeout(() => {
    if (tabId === 'timeline') {
      createTimelineChart();
    } else if (tabId === 'horarios') {
      createHourChart();
      updateHourSlotsDisplay();
    } else if (tabId === 'utm-ranking') {
      createUTMChart();
    }
  }, 100);
}

// Export functions for potential external use
window.dashboardApp = {
  data: dashboardData,
  createTimelineChart,
  createHourChart,
  createUTMChart,
  updateTimelineChart,
  switchToTab,
  updateHourSlotsDisplay
};
<!-- src/components/ChartBar.vue -->
<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type ChartEntry = {
  name: string
  total: number
  predicted: number
}

const props = defineProps<{
  data: ChartEntry[]
}>()

const chartData = {
  labels: props.data.map((item) => item.name),
  datasets: [
    {
      label: 'Total',
      data: props.data.map((item) => item.total),
      backgroundColor: '#61DAFB',
      borderRadius: 6,
      barThickness: 24,
    },
    {
      label: 'Predicted',
      data: props.data.map((item) => item.predicted),
      backgroundColor: '#CBD5E1',
      borderRadius: 6,
      barThickness: 24,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#6B7280',
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.raw
          return `$ ${new Intl.NumberFormat('en-US').format(value)}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#6B7280',
      },
      grid: {
        color: '#E5E7EB',
      },
    },
    y: {
      ticks: {
        color: '#6B7280',
        callback: (value: number) => `$ ${new Intl.NumberFormat('en-US').format(value)}`,
      },
      grid: {
        color: '#E5E7EB',
      },
    },
  },
}
</script>

<template>
  <div class="w-full h-80 rounded-xl border bg-background p-4 shadow">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

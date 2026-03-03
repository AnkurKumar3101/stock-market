import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const LineChart = ({ data, title, isPositive }) => {
    const chartColor = isPositive ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)';
    const bgColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    const chartData = {
        labels: data.map((d) => d.label),
        datasets: [
            {
                label: 'Value ($)',
                data: data.map((d) => d.value),
                borderColor: chartColor,
                backgroundColor: bgColor,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: !!title,
                text: title,
                color: '#6B7280',
                font: {
                    size: 14,
                    weight: 'normal',
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                titleColor: '#F3F4F6',
                bodyColor: '#F3F4F6',
                borderColor: 'rgba(75, 85, 99, 0.5)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                    color: '#9CA3AF',
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    }
                }
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
    };

    return <Line options={options} data={chartData} />;
};

export default LineChart;

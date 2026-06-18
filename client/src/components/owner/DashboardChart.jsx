import React from 'react'

import {

Chart as ChartJS,

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

}

from 'chart.js'

import { Line }

from 'react-chartjs-2'

ChartJS.register(

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

)

const DashboardChart = ({dashboardData}) => {

const chartData = {

labels: Object.keys(

dashboardData.bookingsPerMonth || {}

),

datasets:[{

label:'Bookings',

data:Object.values(

dashboardData.bookingsPerMonth || {}

),

borderColor:'#3B82F6',

backgroundColor:'rgba(59,130,246,0.2)',

tension:0.4

}]

}

return(

<div className='p-6 border border-borderColor rounded-md w-full'>

<h1 className='text-lg font-medium'>

Bookings Per Month

</h1>

<p className='text-gray-500 mb-5'>

Last 6 months overview

</p>

<Line

data={chartData}

/>

</div>

)

}

export default DashboardChart
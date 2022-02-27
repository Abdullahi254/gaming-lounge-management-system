import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../../contexts/AuthContext';
import { projectFireStore as db } from '../../../firebase/firebase';

const StyledBox = styled(Box)(({ theme }) => ({
    maxWidth: '700px',
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    margin: 10,
    marginTop:10,
    marginBottom:0,
    borderRadius: '30px',
    flexWrap: 'nowrap',
    width: '650px',
    height: '400px',
    [theme.breakpoints.down('xl')]: {
        height: '300px',
        width:'450px'
    },
    [theme.breakpoints.down('md')]: {
        height: '300px'
    },
}))

function SalesChart() {
    const { currentUser } = useAuth()
    const [rawData, setRawData] = useState([])
    const [finalData, setData] = useState([])

    useEffect(() => {
        function getStatements() {
            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const currentMonthIndex = currentDate.getMonth()

            let earlierMonthIndex = (currentMonthIndex - 6)
            let earlierYear = currentYear
            if (earlierMonthIndex < 0) {
                earlierMonthIndex += 12
                earlierYear -= 1
            }
            const earlierDate = new Date(earlierYear, earlierMonthIndex)

            const query = db.collection(`users/${currentUser.uid}/statements`).where('date', '>=', earlierDate)
                .where('date', '<=', currentDate).orderBy('date', 'asc')
            query.onSnapshot(querySnapshot => {
                if (!querySnapshot.empty) {
                    setRawData(querySnapshot.docs.map(doc => doc.data()))
                }
            }, err => {
                console.log(err)
            })
        }
        getStatements()
        return () => setRawData([])
    }, [currentUser])

    useEffect(() => {
        let data = []
        for (let i = 0; i <= 6; i++) {
            data[i] = rawData.filter((obj) => {
                const currentDate = new Date()
                const currentYear = currentDate.getFullYear()
                const currentMonthIndex = currentDate.getMonth()

                let earlierMonthIndex = (currentMonthIndex - i)
                let earlierYear = currentYear
                if (earlierMonthIndex < 0) {
                    earlierMonthIndex += 12
                    earlierYear -= 1
                }

                if (obj.month === earlierMonthIndex && obj.year === earlierYear) {
                    return obj
                }
                else return null

            })
        }
        data.reverse()

        let chartData = []

        for (let i = 0; i <= 6; i++) {
            if (data[i].length > 0) {
                let totalSum = data[i].map(item => item.amount).reduce((prev, curr) => prev + curr, 0)
                let obj = {
                    "name": `${6 - i} months ago.`,
                    "sales": totalSum
                }
                chartData.push(obj)
            } else {
                let obj = {
                    "name": `${6 - i} months ago.`,
                    "sales": 0
                }
                chartData.push(obj)
            }
        }

        setData(chartData)


    }, [rawData])

    return (
        <StyledBox>
            <ResponsiveContainer>
                <BarChart data={finalData} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#FE6B8B" />
                </BarChart>
            </ResponsiveContainer>

        </StyledBox>
    )
}

export default SalesChart
